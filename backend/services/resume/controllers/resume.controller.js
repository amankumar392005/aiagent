
// pdf ----> pdf Storage ---> text ---> llm ---> agent ---> prompt ---> data ---> save mongoDb ---> redis --> pdf delete ---> resume data (score, missing skills, recommen.)

import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agent.js";
import extractText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import fs from "fs";

// Sanitize LLM response to match the Mongoose schema
const sanitizeResumeData = (data) => {
    const ensureArrayOfObjects = (arr, keys) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => {
            if (typeof item === "string") {
                return { [keys[0]]: item };
            }
            if (typeof item === "object" && item !== null) {
                const obj = {};
                for (const key of keys) {
                    obj[key] = typeof item[key] === "string" ? item[key] : (item[key] != null ? String(item[key]) : "");
                }
                return obj;
            }
            return { [keys[0]]: String(item) };
        });
    };

    const ensureStringArray = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => typeof item === "string" ? item : String(item));
    };

    return {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        summary: data.summary || "",
        score: Number(data.score) || 0,
        skills: ensureStringArray(data.skills),
        projects: ensureArrayOfObjects(data.projects, ["name", "description"]),
        education: ensureArrayOfObjects(data.education, ["degree", "institution", "period", "cgpa"]),
        experience: ensureArrayOfObjects(data.experience, ["title", "organization", "duration", "details"]),
        strengths: ensureStringArray(data.strengths),
        weaknesses: ensureStringArray(data.weaknesses),
        missingSkills: ensureStringArray(data.missingSkills),
        suggestedRole: data.suggestedRole || "",
        recommendations: ensureStringArray(data.recommendations),
    };
};

export const uploadResume = async (req, res) => {
    const file = req.file;

    try {
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }

        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required"
            });
        }

        const resumeText = await extractText(file.path);

        const aiResponse = await resumeAgent(resumeText);

        // Strip markdown code fences if present
        let cleanResponse = aiResponse.trim();
        if (cleanResponse.startsWith("```")) {
            cleanResponse = cleanResponse.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }

        const rawData = JSON.parse(cleanResponse);
        const resumeData = sanitizeResumeData(rawData);

        let resume = await Resume.findOne({ userId });

        if (resume) {
            Object.assign(resume, {
                ...resumeData,
                extractedText: resumeText
            });

            await resume.save();
        } else {
            resume = await Resume.create({
                userId,
                extractedText: resumeText,
                ...resumeData
            });
        }

        await redis.set(
            `resume:${userId}`,
            JSON.stringify(resume)
        );

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(200).json({
            success: true,
            message: "Resume analyzed successfully",
            data: resume
        });

    } catch (error) {
        console.log(error);

        if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getResume = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        const cache = await redis.get(`resume:${userId}`);

        if (cache) {
            return res.status(200).json({
                success: true,
                source: "redis",
                data: JSON.parse(cache)
            });
        }

        const resume = await Resume.findOne({ userId });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "resume not found"
            });
        }

        await redis.set(
            `resume:${userId}`,
            JSON.stringify(resume)
        );

        return res.status(200).json({
            success: true,
            source: "mongoDb",
            data: resume
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
