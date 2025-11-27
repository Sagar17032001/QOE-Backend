const TestResult = require("./models/TestResult");

app.post("/api/users/save", async (req, res) => {
  try {
    const newResult = new TestResult({
      email: req.body.email,
      ts: req.body.timestamp || Date.now(),
      voip: req.body.voip,
      local: req.body.local,
      youtube: req.body.youtube,
      speed: req.body.speed
    });

    const saved = await newResult.save();
    res.status(201).json({ success: true, id: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
