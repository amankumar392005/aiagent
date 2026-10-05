import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import llm from "../config/llm.js"

export const resumeAgent = async (resumeText) => {
    const response = await llm.invoke([
        new SystemMessage(`You are an Expert ATS Resume Analyzer.

Analyze the given resume and extract information.

IMPORTANT RULES:
1. Return ONLY valid JSON. No markdown, no explanation, no extra text.
2. Every field must exist.
3. projects MUST be array of objects with "name" and "description" keys.
4. education MUST be array of objects with "degree", "institution", "period", "cgpa" keys.
5. experience MUST be array of objects with "title", "organization", "duration", "details" keys.
6. skills, strengths, weaknesses, missingSkills, recommendations MUST be arrays of strings.

Response Format:
{"name":"","email":"","phone":"","summary":"","skills":["skill1"],"projects":[{"name":"project name","description":"project description"}],"education":[{"degree":"","institution":"","period":"","cgpa":""}],"experience":[{"title":"","organization":"","duration":"","details":""}],"strengths":[""],"weaknesses":[""],"missingSkills":[""],"suggestedRole":"","score":0,"recommendations":[""]}`),
       new HumanMessage(resumeText),
    ])

    return response.content;
}
