import dotenv from "dotenv";
dotenv.config();
import { chat } from "./chatbot.js";

const chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(404).json({
        message: "Please write message !!!",
      });
    }
    const response = await chat(message);

    res.status(201).json({
      message: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error!!",
    });
  }
};

export default chatbot;
