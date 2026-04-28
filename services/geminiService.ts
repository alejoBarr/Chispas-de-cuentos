import { GoogleGenerativeAI, SchemaType, GenerationConfig } from "@google/generative-ai";
import { Story } from "../types";
import { CONFIG } from "./config";

/**
 * Generación de imagen (Simulada o mediante Fallback)
 */
export const generateImage = async (prompt: string, _emoji: string = '📖'): Promise<string> => {
    // Usamos Pollinations AI para generar imágenes reales basadas en el prompt del cuento
    const encodedPrompt = encodeURIComponent(`${prompt}, children's book illustration style, vibrant and magical, high quality, soft colors`);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
};

export const generateStoryFromPrompt = async (
    prompt: string, 
    characterName: string, 
    storyStyle: string
): Promise<Story> => {
    let lastError: any = null;

    for (const key of CONFIG.API_KEYS) {
        try {
            const aiInstance = new GoogleGenerativeAI(key);
            
            const generationConfig: GenerationConfig = {
                responseMimeType: "application/json",
                temperature: 0.8,
            };

            const fullPrompt = `Crea un cuento infantil corto y mágico basado en la siguiente idea: "${prompt}".
            El personaje principal se llama ${characterName || 'nuestro amigo'}.
            El estilo del cuento debe ser: "${storyStyle}". ¡MUY IMPORTANTE!: El cuento DEBE tener exactamente 4 páginas, ni más ni menos.
            El cuento debe tener un título creativo y exactamente 4 páginas.
            Elige UN ÚNICO emoji que sea muy representativo y único según el tema principal del cuento. Ejemplos: si trata de un dragón usa 🐉, del mar usa 🌊, de la noche estrellada usa 🌙, de un robot usa 🤖, etc. El emoji debe capturar la esencia del cuento, NO uses emojis genéricos como ✨ o 📖 a menos que encajen perfectamente.
            Para cada página, escribe un párrafo de texto (máximo 40-50 palabras) y un prompt detallado para generar una ilustración al estilo de un libro de cuentos infantil, vibrante y mágico, que se corresponda con el estilo solicitado.
            Asegúrate de que el nombre del personaje, ${characterName || ''}, aparezca en el texto del cuento si se proporciona.
            Responde únicamente con el objeto JSON.`;

            const model = aiInstance.getGenerativeModel({
                model: CONFIG.MODEL_NAME,
                generationConfig: {
                    ...generationConfig,
                    responseSchema: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING },
                            emoji: { type: SchemaType.STRING },
                            pages: {
                                type: SchemaType.ARRAY,
                                items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        text: { type: SchemaType.STRING },
                                        imagePrompt: { type: SchemaType.STRING }
                                    },
                                    required: ["text", "imagePrompt"]
                                }
                            }
                        },
                        required: ["title", "emoji", "pages"]
                    }
                },
            });

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            let jsonText = response.text().trim();
            
            // Limpiar posibles bloques de código markdown si la IA los incluye
            jsonText = jsonText.replace(/^```json\s?|```$/g, '').trim();

            const storyData = JSON.parse(jsonText);
            
            if (!storyData.title || !storyData.pages || storyData.pages.length === 0) {
                throw new Error("Generated story data is incomplete.");
            }

            return { 
                ...storyData, 
                pages: storyData.pages, 
                isGenerated: true 
            } as Story;

        } catch (error) {
            console.warn(`Error con la clave de API: ${error instanceof Error ? error.message : String(error)}. Probando con la siguiente...`);
            lastError = error;
            continue; // Prueba con la siguiente clave
        }
    }

    console.error("Error generating story after trying all keys:", lastError);
    throw new Error("No se pudo crear el cuento. ¡La magia de todas nuestras IAs necesita un descanso! Inténtalo de nuevo.");
};
