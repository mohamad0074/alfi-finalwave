import { GoogleGenerativeAI } from "@google/generative-ai"

const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"
const DEFAULT_SYSTEM_INSTRUCTION = "Anda adalah Alfi, asisten AI yang ramah dan membantu."

const modelMapper = {
  flash: "gemini-1.5-flash",
  "flash-lite": "gemini-1.5-flash",
  pro: "gemini-1.5-pro",
}

const determineGeminiModel = (key) => modelMapper[key] ?? DEFAULT_GEMINI_MODEL

const extractGeneratedText = (result) => {
  try {
    return result.response.text() || "Maaf, saya tidak dapat memberikan respons saat ini."
  } catch (err) {
    console.error("Error extracting text:", err)
    return "Maaf, terjadi kesalahan dalam memproses respons."
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  if (!req.body) {
    return res.status(400).json({ message: "Invalid request body!" })
  }

  const { message, model } = req.body

  if (!message) {
    return res.status(400).json({ message: "Pesannya masih kosong nih!" })
  }

  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY

  if (!apiKey) {
    return res.status(500).json({ message: "API key tidak ditemukan!" })
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    const model_instance = genAI.getGenerativeModel({
      model: determineGeminiModel(model ?? "flash"),
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
    })

    const result = await model_instance.generateContent(message)

    const reply = extractGeneratedText(result)

    res.json({ reply })
  } catch (e) {
    console.error("API Error:", e)
    res.status(500).json({ message: `Error: ${e.message}` })
  }
}
