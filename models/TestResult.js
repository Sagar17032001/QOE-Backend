const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  ts: { type: Date, default: Date.now },
  voip: Object,
  local: Object,
  youtube: Object,
  speed: Object
});

module.exports = mongoose.model("TestResult", testResultSchema);
