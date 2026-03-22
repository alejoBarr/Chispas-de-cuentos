import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testApi() {
    try {
        console.log("Testing Audio Generation...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: "Hola!" }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Aoede" },
                    },
                },
            },
        });
        console.log("Audio generation SUCCESS!", !!response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data);
    } catch (e) {
        console.error("Audio generation FAILED:", e.message);
    }
}
testApi();
