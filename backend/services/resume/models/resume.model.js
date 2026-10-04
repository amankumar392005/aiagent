
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true,
    },

    extractedText: {
        type: String,
        required: true,
    },

    score: {
        type: Number,
        default: 0,
    },

    summary: {
        type: String,
        default: "",
    },

    name: {
        type: String,
        default: "",
    },

    email: {
        type: String,
        default: "",
    },

    phone: {
        type: String,
        default: "",
    },

    education: {
        type: [{
            degree: {
                type: String,
                default: "",
            },
            institution: {
                type: String,
                default: "",
            },
            period: {
                type: String,
                default: "",
            },
            cgpa: {
                type: String,
                default: "",
            },
        }],
        default: [],
    },

    skills: {
        type: [String],
        default: [],
    },

    projects: {
        type: [{
            name: {
                type: String,
                default: "",
            },
            description: {
                type: String,
                default: "",
            },
        }],
        default: [],
    },

    experience: {
        type: [{
            title: {
                type: String,
                default: "",
            },
            organization: {
                type: String,
                default: "",
            },
            duration: {
                type: String,
                default: "",
            },
            details: {
                type: String,
                default: "",
            },
        }],
        default: [],
    },

    strengths: {
        type: [String],
        default: [],
    },

    weaknesses: {
        type: [String],
        default: [],
    },

    missingSkills: {
        type: [String],
        default: [],
    },

    suggestedRole: {
        type: String,
        default: "",
    },

    recommendations: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;

