import fs from "node:fs";

if (!fs.existsSync("dist")) {
  console.error("❌ dist was not created. Check Vite errors above.");
  process.exit(1);
} else {
  console.log("✅ dist exists.");
}