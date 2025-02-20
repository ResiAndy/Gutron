const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.generateImage = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Replace this with your actual OpenAI API key
      const apiKey = ""; 
      if (!req.body.prompt) {
        return res.status(400).json({ error: "Missing prompt in request body" });
      }

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "dall-e-3",  
          prompt: req.body.prompt,
          n: 1,
          size: "1024x1024",  
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Set necessary CORS headers on the response
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      return res.status(200).json(response.data);
    } catch (error) {
      console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
      return res.status(500).json({
        error: "Failed to generate image",
        details: error.response ? error.response.data : error.message,
      });
    }
  });
});
