
import { GoogleGenAI, Type } from "@google/genai";
import type { Lesson, EvaluationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLesson(path: string, level: number): Promise<Lesson> {
    const prompt = `
    Act as a 'Code Dungeon Master' for a fantasy RPG where players learn programming.
    Create a new quest (a lesson) for a level ${level} adventurer learning ${path}.

    The quest should include:
    1.  A short, engaging fantasy narrative that frames the problem.
    2.  A clear, specific coding task.
    3.  If applicable for a beginner (level 1-3), a simple code example. For higher levels, this can be omitted.

    The tone should be epic, encouraging, and fun. Keep the scope of the task appropriate for the player's level.

    Respond ONLY with a valid JSON object following this schema. Do not include markdown formatting like \`\`\`json.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "An epic, quest-like title for the lesson." },
                        narrative: { type: Type.STRING, description: "The fantasy story or scenario for the quest." },
                        task: { type: Type.STRING, description: "The specific coding challenge the player must complete." },
                        exampleCode: { type: Type.STRING, description: "A small code snippet to guide the player. Optional." }
                    },
                    required: ["title", "narrative", "task"]
                },
            },
        });

        const lessonText = response.text.trim();
        return JSON.parse(lessonText) as Lesson;
    } catch (error) {
        console.error("Error generating lesson:", error);
        // Provide a fallback lesson on error
        return {
            title: "The Coder's Gauntlet",
            narrative: "The connection to the Oracle has been severed! A temporary challenge awaits you until the connection is restored.",
            task: "Create a 'Hello, World!' program in your chosen language. This will prove your readiness for the quests to come.",
            exampleCode: path === 'python' ? "print('Hello, World!')" : ""
        };
    }
}

export async function evaluateCode(path: string, task: string, userCode: string): Promise<EvaluationResult> {
    const prompt = `
    As a 'Code Sage', evaluate a code submission in a programming RPG.
    The language is: ${path}.
    The assigned task was: "${task}".

    The student's code is:
    \`\`\`${path.split('_')[0]}
    ${userCode}
    \`\`\`

    Analyze the code for correctness in solving the task. Provide constructive, encouraging feedback in a fantasy RPG style.

    Respond ONLY with a valid JSON object following this schema. Do not include markdown formatting like \`\`\`json.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN, description: "Is the code a correct solution to the task?" },
                        feedback: { type: Type.STRING, description: "Encouraging, RPG-themed feedback for the student." }
                    },
                    required: ["isCorrect", "feedback"]
                },
            },
        });

        const evaluationText = response.text.trim();
        return JSON.parse(evaluationText) as EvaluationResult;
    } catch (error) {
        console.error("Error evaluating code:", error);
        return {
            isCorrect: false,
            feedback: "A mysterious force prevents me from evaluating your scroll. Check your incantation and the Oracle's connection, then try again."
        };
    }
}
