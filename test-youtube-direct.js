const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcoded for test script only
const API_KEY = "AIzaSyCLiFy4MQiKm02kRaFUM8BzSqvcAFUzhks";

async function test() {
    console.log("Initializing Gemini...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Matching the model name from lib/gemini.ts
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("Sending request with YouTube URL...");
    try {
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: "video/mp4",
                    fileUri: "https://www.youtube.com/watch?v=3KtWfp0UopM"
                }
            },
            "What is this video about? Please provide a short summary."
        ]);

        console.log("--- SUCCESS ---");
        console.log(result.response.text());
    } catch (error) {
        console.error("--- ERROR ---");
        console.error(error.message);
        if (error.response) {
            console.error(JSON.stringify(error.response, null, 2));
        }
    }
}

test();
