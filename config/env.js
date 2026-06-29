const path = require("path");
const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

const result = dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

if (result.error)
  console.error("[env] Failed to load env file:", result.error.message);
