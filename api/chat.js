import { GoogleGenAI } from '@google/genai';

// Untuk local development, aktifkan dotenv (tidak masalah di Vercel, akan diabaikan)
if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
  try {
    require('dotenv').config();
  } catch (e) {}
}

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_SYSTEM_INSTRUCTION = "Anda adalah Digital marketing terhandal.";
const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;

const modelMapper = {
  'flash': 'gemini-2.5-flash',
  'flash-lite': 'gemini-2.5-flash-lite',
  'pro': 'gemini-2.5-pro'
};

const determineGeminiModel = (key) => modelMapper[key] ?? DEFAULT_GEMINI_MODEL;

const extractGeneratedText = (data) => {
  try {
    const text =
      data?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.response?.candidates?.[0]?.content?.text;
    return text ?? JSON.stringify(data, null, 2);
  } catch (err) {
    return JSON.stringify(data, null, 2);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!GOOGLE_AI_STUDIO_API_KEY) {
    return res.status(500).json({ message: "API key tidak ditemukan di environment variable." });
  }

  if (!req.body) {
    return res.status(400).json({ message: "Invalid request body!" });
  }

  const { messages, model } = req.body;

  if (!messages) {
    return res.status(400).json({ message: "Pesannya masih kosong nih!" });
  }

  const payload = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const ai = new GoogleGenAI({
    apiKey: GOOGLE_AI_STUDIO_API_KEY
  });

  try {
    const aiResponse = await ai.models.generateContent({
      model: determineGeminiModel(model ?? 'pro'),
      contents: payload,
      config: {
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION
      }
    });

    res.json({ reply: extractGeneratedText(aiResponse) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}