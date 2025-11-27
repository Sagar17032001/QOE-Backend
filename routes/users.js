const express = require("express");
const router = express.Router();
const TestResult = require("../models/TestResult");

// Save a new test result
router.post("/save", async (req, res) => {
    console.log("Request body:", req.body); // <-- add this
    try {
      const data = req.body;
      if (!data.email) return res.status(400).json({ error: "Email is required" });
  
      const result = new TestResult(data);
      await result.save();
      console.log("Test record saved!");
      res.json({ success: true, id: result._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  



// Get latest 100 results
router.get("/results", async (req, res) => {
  try {
    const results = await TestResult.find().sort({ ts: -1 }).limit(100);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
