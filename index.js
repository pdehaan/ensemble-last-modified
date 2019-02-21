const axios = require("axios");
const express = require("express");
const ms = require("ms");

const packageJson = require("./package.json");

const client = axios.create({
  baseURL: "https://data.firefox.com/"
});

const dashboards = [
  "/datasets/desktop/user-activity",
  "/datasets/desktop/usage-behavior",
  "/datasets/desktop/hardware"
];

const app = express();
app.get("/", async (req, res) => {
  const {data: versionJson} = await client.get("/__version__");

  const ages = {};
  for (const dashboardUrl of dashboards) {
    ages[dashboardUrl] = await lastModified(dashboardUrl);
  }

  versionJson.dashboads = ages;
  versionJson.homepage = packageJson.homepage;

  res.json(versionJson);
});

module.exports = app;

async function lastModified(uri) {
  const { data } = await client.get(uri);
  const date = data.dates[0];
  return ms(new Date(date) - Date.now());
}
