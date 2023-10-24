const express = require("express");
const axios = require("axios");
const openaiRouter = express.Router();
require("dotenv").config();

const API_KEY = process.env.OPENAI_API_KEY;

openaiRouter.post("/generate", async (req, res) => {
  try {
    const { action, content, targetLanguage } = req.body;

    if (!content || !action) {
      return res.status(400).json({ error: "content and action are required" });
    }

    let responseContent = "";

    if (action === "generateText") {
      // Use GPT-3.5-turbo for text generation
      const gptRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `create contextually relevant text using ${content} and it should be human-like`,
          },
        ],
        max_tokens: 100,
      };

      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        gptRequest,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      responseContent = gptResponse.data.choices[0].message.content;
    } else if (action === "summarizeText") {
      if (!content) {
        return res.status(400).json({ error: "content is required for summarization" });
      }

      // Use GPT-3.5-turbo for text summarization with a specific prompt
      const gptRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Summarize the following text: ${content}`,
          },
        ],
        max_tokens: 100,
      };

      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        gptRequest,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      responseContent = gptResponse.data.choices[0].message.content;
    } else if (action === "translateText") {
      if (!content || !targetLanguage) {
        return res.status(400).json({ error: "content and targetLanguage are required for translation" });
      }

      // Use GPT-3.5-turbo for text translation
      const gptRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Translate the following text to ${targetLanguage}: ${content}`,
          },
        ],
        max_tokens: 150,
      };

      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        gptRequest,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      responseContent = gptResponse.data.choices[0].message.content;
    } else {
      return res.status(400).json({ error: "Invalid action specified" });
    }

    res.json({ result: responseContent });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = openaiRouter;
