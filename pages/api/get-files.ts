// /pages/api/get-files.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const folderName = req.query.folder as string;

  if (!folderName) {
    return res.status(400).json({ error: "Folder name is required" });
  }

  const directoryPath = path.join(process.cwd(), "data", folderName);

  try {
    if (!fs.existsSync(directoryPath)) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => fs.statSync(path.join(directoryPath, file)).isFile());

    res.status(200).json({ files });
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    res.status(500).json({ error: "Failed to read directory" });
  }
}
