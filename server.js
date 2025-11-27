const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5050;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// MongoDB connection
const MONGO_URI = "mongodb+srv://sagarsamrat1703_db_user:ll2DRIKiirCO2Jkr@qoeresult.5ex3zoh.mongodb.net/";
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000
})
.then(() => console.log("Connected to MongoDB from Vercel!"))
.catch((err) => console.error("MongoDB connection error:", err));

    // // Test saving a dummy record
    // const TestResult = require("./models/TestResult");
    // const test = new TestResult({ email: "test@example.com" });
    // test.save()
    //   .then(() => console.log("Test record saved!"))
    //   .catch(err => console.error("Save error:", err));

  })
  .catch(err => console.error("MongoDB connection error:", err));

app.get('/api/users/results', async (req, res) => {
  try {
    const results = await TestResult.find(); // 👈 your model name
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching test results" });
  }
});

app.get('/', (req, res) => {
  res.send('QoE Backend API is running ✔️');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
