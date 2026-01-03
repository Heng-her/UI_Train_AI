// /pages/api/export-folder.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import archiver from "archiver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const folderName = req.query.name as string;

  if (!folderName) return res.status(400).json({ error: "Folder name is required" });

  const folderPath = path.join(process.cwd(), "data", folderName);

  if (!fs.existsSync(folderPath)) return res.status(404).json({ error: "Folder not found" });

  // Set headers for ZIP download
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename=${folderName}.zip`);

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // Add all .txt files from the folder
  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".txt"));
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    archive.file(filePath, { name: file });
  });

  await archive.finalize();
}
