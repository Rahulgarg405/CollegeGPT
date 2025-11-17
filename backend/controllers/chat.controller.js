import dotenv from "dotenv";
dotenv.config();
import { chat } from "./chatbot.js";
import Groq from "groq-sdk";
import { vectorStore } from "./index.controller.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatbot = async (req, res) => {
  try {
    const { summary, recentMessages, message } = req.body;

    if (!message) {
      return res.status(404).json({
        message: "Please write message !!!",
      });
    }

    const relevantChunks = await vectorStore.similaritySearch(message, 8);

    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");

    const SYSTEM_PROMPT = `
You are CollegeGPT — a friendly and intelligent virtual assistant for Rajasthan Technical University (RTU), Kota.

 Your main goal:
Help RTU students and faculty by providing accurate and concise answers using the provided context. The context may include syllabus, faculty details, timetables, and other academic resources.

 When answering academic questions:
- Use the retrieved context and your general academic understanding.
- If the answer is not clearly available in the context, say:
  "I’m not sure about that. Please check with your department or university website."
- Keep your answers clear, student-friendly, and structured.
- Never make up information.

 When the user greets or talks casually (e.g., "hi", "hello", "how are you?", "who are you?"):
- Respond naturally and politely.
- You can introduce yourself as CollegeGPT, the RTU academic assistant.
- Keep it short, friendly, and relevant.

 Tone:
- Warm, respectful, and supportive — like a helpful university guide.
- Avoid slang, sarcasm, or informal internet tone.

 Example behavior:

Q: "What subjects are there in 3rd semester CSE?"
A: "In the 3rd semester of CSE at RTU, students typically study Data Structures, Digital Electronics, Discrete Mathematics, and Object-Oriented Programming as per the RTU syllabus."

Q: "Hi!"
A: "Hello! I’m CollegeGPT, your academic assistant from RTU. How can I help you today?"

Q: "Who created you?"
A: "I was developed as part of the CollegeGPT project to help RTU students easily access syllabus, faculty, and academic information."

Q: "What’s the time?"
A: "I don’t have access to real-time data, but I can help you with RTU-related information!"
`;

    const userQuery = `Question: ${message}
    Relevant Context: ${context}
    Answer: `;

    const messagesToSend = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "assistant", content: `Conversation Summary: ${summary}` },
      ...recentMessages,
      { role: "user", content: userQuery },
    ];

    const completion = await groq.chat.completions.create({
      messages: messagesToSend,
      model: "llama-3.3-70b-versatile",
    });

    const assistantReply = completion.choices[0].message.content;

    const summaryQuery = `Old summary:\n${summary}\n\nNew exchange:\nUser: ${message}\nAssistant: ${assistantReply}`;
    const summaryPrompt = [
      {
        role: "system",
        content: "Summarize this conversation in 2–4 concise sentences.",
      },
      { role: "user", content: summaryQuery },
    ];

    const summaryRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: summaryPrompt,
    });

    const updatedSummary = summaryRes.choices[0].message.content;

    // const response = await chat(message);

    res.status(201).json({
      message: assistantReply,
      summary: updatedSummary,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Error!! in chatbot",
    });
  }
};

export default chatbot;
