import { GoogleGenerativeAI } from "@google/generative-ai";
import Session from "../models/Session.js";

// Initialize Gemini
// We will look for GEMINI_API_KEY in .env
// If not found, we will return a mock response or error
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateSessionInsights = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "GEMINI_API_KEY not configured in backend" });
        }

        const prompt = `
      You are an expert technical interviewer.
      A coding interview session has been created for the following problem:
      
      Problem: "${session.problem}"
      Difficulty: "${session.difficulty}"

      Please provide a concise "Interviewer Guide" for the host. 
      Do NOT solve the problem directly for them, but give them:
      1. Key concepts to look for (what should the candidate mention?).
      2. Potential pitfalls (common mistakes).
      3. A few hint questions the interviewer can ask if the candidate is stuck.
      
      Format the response in Markdown. Keep it brief and helpful for a real-time interviewer.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Save to DB so we don't regenerate every time
        session.aiInsights = text;
        await session.save();

        res.json({ insights: text });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: `AI Error: ${error.message}` });
    }
};
