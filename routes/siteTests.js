const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/dns", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const start = Date.now();
    await axios.get(`https://dns.google/resolve?name=${url}`);
    const dnsTime = Date.now() - start;

    res.json({
      success: true,
      url,
      dnsTime
    });

  } catch (err) {
    res.status(500).json({ error: "DNS test failed" });
  }
});

module.exports = router;
