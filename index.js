const axios = require("axios");
const express = require("express");
const ms = require("ms");

const dashboards = [
  "https://data.firefox.com/datasets/desktop/user-activity",
  "https://data.firefox.com/datasets/desktop/usage-behavior",
  "https://data.firefox.com/datasets/desktop/hardware"
];

const app = express();
app.get("/", async (req, res) => {
  const ages = [];
  for (const dashboardUrl of dashboards) {
    const dashboardAge = await lastModified(dashboardUrl);
    ages.push({
      dashboardUrl,
      dashboardAge
    });
  }
  res.json(ages);
});

module.exports = app;

async function lastModified(uri) {
  const { data } = await axios.get(uri);
  return age(data.dates[0]);
}

function age(date) {
  return ms(new Date(date) - Date.now());
}
