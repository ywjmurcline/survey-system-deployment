const express = require('express');
const router = express.Router();


const API_URL = "https://api2.road2all.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY;

router.post("/api/extract", async (req, res) => {
  const { description } = req.body;

  const prompt = `
Please extract the three most important adjectives that describe the characteristics of the following course. Only return an array of adjectives:
"${description}"
`;

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4-0125-preview",
        messages: [{ role: "user", content: prompt }],
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    let adjectives;
    try {
      adjectives = JSON.parse(reply); // e.g. ["practical", "challenging", "engaging"]
    } catch {
      adjectives = reply
        .replace(/[\[\]\"“”]/g, "")
        .split(/[,\n]/)
        .map((w) => w.trim())
        .filter(Boolean);
    }

    res.json({ adjectives });
  } catch (error) {
    console.error("API call failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to extract adjectives via GPT-4o." });
  }
});

module.exports = router;