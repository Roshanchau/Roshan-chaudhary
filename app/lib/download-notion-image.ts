import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL } from "url";

const IMAGES_DIR = path.resolve(process.cwd(), "public/notion-images");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const getStableFileName = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      const fileId = parts[parts.length - 2];
      const fileName = parts[parts.length - 1];
      const ext = path.extname(fileName) || ".png";
      return `${fileId}${ext}`;
    }
    return null;
  } catch {
    return null;
  }
};

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location!, dest)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(
          new Error(`Failed to download: HTTP ${response.statusCode} for ${url}`)
        );
      }

      response.pipe(file);
    file.on("finish", () => file.close(() => resolve()));
    });

    request.on("error", (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
};

export const downloadNotionImage = async (url: string): Promise<string | null> => {
  if (!url || !url.startsWith("http")) return null;

  if (!url.includes("prod-files-secure.s3")) {
    return null;
  }

  const fileName = getStableFileName(url);
  if (!fileName) return null;

  const localPath = path.join(IMAGES_DIR, fileName);
  const publicUrl = `/notion-images/${fileName}`;

  if (fs.existsSync(localPath)) {
    return publicUrl;
  }

  try {
    await downloadFile(url, localPath);
    return publicUrl;
  } catch (err) {
    console.warn(`Failed to download Notion image: ${fileName}`, err);
    return null;
  }
};

export const replaceNotionImagesInMd = async (md: string): Promise<string> => {
  const urlRegex = /https:\/\/prod-files-secure\.s3[^\s)"']+/g;
  const matches = [...new Set(md.match(urlRegex) ?? [])];

  let result = md;

  for (const url of matches) {
    const localUrl = await downloadNotionImage(url);
    if (localUrl) {
      result = result.split(url).join(localUrl);
    }
  }

  return result;
};