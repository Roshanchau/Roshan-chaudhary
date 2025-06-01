import fs from "fs";
import path from "path";

const getConfig = (config: string[]) => `/**
 * @type {import('next-export-optimize-images').Config}
 */
const config = {
  remoteImages: ${JSON.stringify(config, null, 2)},
}

module.exports = config`;

async function addRemoteImage(image: string | string[]) {
  try {
    const images = Array.isArray(image) ? image : [image];
    const p = path.resolve(process.cwd(), "export-images.config.js");

    let existingData: string[] = [];

    // Check if file exists and read existing data
    if (fs.existsSync(p)) {
      try {
        const fileContent = fs.readFileSync(p, "utf-8");
        // Extract existing remoteImages array
        const match = fileContent.match(/remoteImages:\s*(\[[\s\S]*?\])/);
        if (match) {
          try {
            existingData = JSON.parse(match[1]);
          } catch {
            console.warn("Error parsing existing remoteImages, creating new array");
            existingData = [];
          }
        }
      } catch (err) {
        console.warn("Error reading existing file, creating new one:", err);
      }
    }

    // Filter and combine data
    const newData = [...existingData, ...images].filter(
      (item, index, self) =>
        item && // Remove null/undefined
        item.trim() !== "" && // Remove empty strings
        self.indexOf(item) === index && // Remove duplicates
        item.startsWith("http") // Ensure it's a valid URL
    );

    // Write the updated data
    fs.writeFileSync(p, getConfig(newData));

    return newData;
  } catch (e) {
    console.error("Error adding remote image:", e);
    process.exit(1);
  }
}

export default addRemoteImage;