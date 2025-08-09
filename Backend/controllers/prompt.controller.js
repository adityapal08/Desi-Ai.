import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
import { Prompt } from "../models/prompt.model.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//const prompt = "Explain how AI works";

//const result = await model.generateContent(prompt);
//console.log(result.response.text());
console.log("🔑 API KEY:", process.env.GOOGLE_GEMINI_KEY);

export const sendPrompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Prompt content is required" });
  }
  try {
    //save user prompt
    const userPrompt = await Prompt.create({
      role: "user",
      content,
      user: userId,
    });
    const completion = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: content }],
        },
      ],
    });
    const aiContent = completion.response.text();
    console.log("Gemini Response:\n", aiContent);
    //save assistant prompt
    const aiMessage = await Prompt.create({
      role: "assistant",
      content: aiContent,
      user: userId,
    });
    return res.status(200).json({ reply: aiContent });
  } catch (error) {
    console.log("Error in Prompt:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong with the ai response" });
  }
};
