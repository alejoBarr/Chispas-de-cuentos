import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Story } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        }
        throw new Error("No audio was generated.");
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
};

export const generateStoryFromPrompt = async (
    prompt: string, 
    characterName: string, 
    storyStyle: string
): Promise<Story> => {
    try {
        const fullPrompt = `Crea un cuento infantil corto y mágico basado en la siguiente idea: "${prompt}".
        El personaje principal se llama ${characterName || 'nuestro amigo'}.
        El estilo del cuento debe ser: "${storyStyle}".
        El cuento debe tener un título creativo, un emoji que lo represente y exactamente 4 páginas.
        Para cada página, escribe un párrafo de texto (máximo 40-50 palabras) y un prompt detallado para generar una ilustración al estilo de un libro de cuentos infantil, vibrante y mágico, que se corresponda con el estilo solicitado.
        Asegúrate de que el nombre del personaje, ${characterName || ''}, aparezca en el texto del cuento si se proporciona.
        Responde únicamente con el objeto JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        emoji: { type: Type.STRING },
                        pages: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    imagePrompt: { type: Type.STRING }
                                },
                                required: ["text", "imagePrompt"]
                            }
                        }
                    },
                    required: ["title", "emoji", "pages"]
                },
            },
        });

        const jsonText = response.text.trim();
        const storyData = JSON.parse(jsonText);

        if (!storyData.title || !storyData.pages || storyData.pages.length === 0) {
            throw new Error("Generated story data is incomplete.");
        }

        return { ...storyData, isGenerated: true } as Story;

    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("No se pudo crear el cuento. ¡La magia de la IA necesita un descanso! Inténtalo de nuevo.");
    }
};
