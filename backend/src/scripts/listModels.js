import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load .env from backend root
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
// Note: adjusting path assuming we run this from src/scripts or similar, 
// but let's just make it robust or rely on user running from backend root.
// Actually, let's just use the standard dotenv.config() and ask user to run from backend dir.
// Since the file is in src/scripts/listModels.js, running from backend/ would mean we need to handle imports correctly.
// Let's keep it simple. User runs `node src/scripts/listModels.js` from `backend` folder.

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Fetching available models...");
        // There isn't a direct listModels on genAI instance in the node SDK readily exposed strictly like this in all versions,
        // but looking at docs/source, it is usually under a model manager or removed. 
        // Wait, the SDK simplifies it: `genAI.getGenerativeModel(...)` is usage.
        // Listing models might need the HTTP endpoint or a specific manager.
        // Actually, checking the error message: "Call ListModels to see the list..."
        // The SDK might not expose it directly in the helper.
        // Let's try to just use a known working model that SHOULD work everywhere: "gemini-1.5-flash-latest"
        // OR create a simple test that TRIES "gemini-1.5-flash" again and prints the specific error stack.

        // Better idea: Just use a standard fetch to the API to list models if SDK doesn't support it easily.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods?.includes("generateContent")) {
                    console.log(`- ${m.name.replace("models/", "")}`);
                }
            });
        } else {
            console.error("❌ Failed to list models:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
