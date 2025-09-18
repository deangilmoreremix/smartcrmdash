import fs from "node:fs";

if (!fs.existsSync("dist/client")) {
  console.error("❌ dist/client was not created. Check Vite errors above.");
  process.exit(1);
} else {
  console.log("✅ dist/client exists.");
}