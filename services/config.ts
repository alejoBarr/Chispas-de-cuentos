/// <reference types="vite/client" />

export const CONFIG = {
  MODEL_NAME: 'gemini-2.5-flash',
  API_KEYS: [
    import.meta.env.VITE_GOOGLE_API_KEY,
    import.meta.env.VITE_GEMINI_API_KEY_1,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_API_KEY
  ].filter((key): key is string => Boolean(key) && typeof key === 'string' && key.length > 10),
};