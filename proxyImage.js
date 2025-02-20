const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// Main function wrapper: calls cors() and then our async handler.
exports.proxyImage = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    return handleProxyImage(req, res);
  });
});

// Separated async function to handle the image proxying.
async function handleProxyImage(req, res) {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing image URL" });
    }
    
    // Fetch the image as binary data.
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    
    // Set CORS and content-type headers.
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", imageResponse.headers['content-type']);
    
    return res.status(200).send(imageResponse.data);
  } catch (error) {
    console.error("Error fetching image:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
}
