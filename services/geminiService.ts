import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Story } from "../types";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("API_KEY environment variable is not set. AI features will be disabled.");
}

// @ts-ignore - Handle missing key gracefully to avoid crashing the whole app
const ai = apiKey ? new GoogleGenAI({ apiKey }) : {
    models: {
        generateContent: async () => { throw new Error("API Key missing"); },
        generateImages: async () => { throw new Error("API Key missing"); }
    }
} as any;

export const generateImage = async (prompt: string, emoji: string = '📖'): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001',
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
        // Fallback to a magical placeholder if the API key doesn't have Imagen access
        const encodedEmoji = encodeURIComponent(`✨${emoji}✨`);
        return `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22800%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23FFD1DC%22%20%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-size%3D%22400%22%3E${encodedEmoji}%3C%2Ftext%3E%3C%2Fsvg%3E`;
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
        El cuento debe tener un título creativo y exactamente 4 páginas.
        Elige UN ÚNICO emoji que sea muy representativo y único según el tema principal del cuento. Ejemplos: si trata de un dragón usa 🐉, del mar usa 🌊, de la noche estrellada usa 🌙, de un robot usa 🤖, etc. El emoji debe capturar la esencia del cuento, NO uses emojis genéricos como ✨ o 📖 a menos que encajen perfectamente.
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
