import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
    console.error("Error: No se encontró la API Key en el archivo .env");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Conectando con Google AI...");
        const models = await ai.models.list();
        console.log("\n--- Modelos Disponibles para tu cuenta ---");
        models.forEach(m => {
            console.log(`- ID: ${m.name} (${m.displayName})`);
        });
        console.log("-------------------------------------------\n");
    } catch (e) {
        console.error("Error al listar modelos:", e.message);
    }
}

listModels();
