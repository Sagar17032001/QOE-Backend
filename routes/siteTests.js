const express = require("express");
const router = express.Router();
const axios = require("axios");
const fetch = require("node-fetch");
const geoip = require("geoip-lite");
const ping = require("ping");
const { performance } = require("perf_hooks");

// Utility to measure time
const measureTime = async (fn) => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
};

// Run All Tests Endpoint
// GET /api/tests/run-all?url=https://example.com&ip=8.8.8.8
router.get("/run-all", async (req, res) => {
  try {
    const { url, ip } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const results = {};

    // 1. DNS Test
    try {
      const { duration: dnsTime } = await measureTime(async () => {
        await axios.get(`https://dns.google/resolve?name=${url}`);
      });
      results.dns = { dnsTime: Math.round(dnsTime) };
    } catch (err) {
      results.dns = { error: err.message };
    }

    // 2. Server Response Time
    try {
      const { duration: serverTime } = await measureTime(async () => {
        await axios.get(url);
      });
      results.server = { serverTime: Math.round(serverTime) };
    } catch (err) {
      results.server = { error: err.message };
    }

    // 3. Page Load Time
    try {
      const { duration: pageLoadTime, result: html } = await measureTime(async () => {
        const response = await fetch(url);
        return await response.text();
      });
      results.pageload = { pageLoadTime: Math.round(pageLoadTime), sizeBytes: html.length };
    } catch (err) {
      results.pageload = { error: err.message };
    }

    // 4. Ping Test
    try {
      const hostname = new URL(url).hostname;
      const pingRes = await ping.promise.probe(hostname);
      results.ping = { time: parseFloat(pingRes.time) || null };
    } catch (err) {
      results.ping = { error: err.message };
    }

    // 5. TTFB (Time to First Byte)
    try {
      const start = performance.now();
      await axios.get(url);
      const ttfb = performance.now() - start;
      results.ttfb = { ttfb: Math.round(ttfb) };
    } catch (err) {
      results.ttfb = { error: err.message };
    }

    // 6. Geo Location (optional, if IP provided)
    if (ip) {
      try {
        const geo = geoip.lookup(ip);
        results.geolocation = geo || { error: "Geo location not found" };
      } catch (err) {
        results.geolocation = { error: err.message };
      }
    }

    res.json({ success: true, url, results });
  } catch (err) {
    res.status(500).json({ error: "Run-all-tests failed", details: err.message });
  }
});

module.exports = router;
