// /pages/api/export-all-folders.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import archiver from "archiver";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dataDir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDir)) {
    return res.status(404).json({ error: "Data directory not found" });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `knowledge; filename=knowledge.zip`
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    console.error(err);
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  const folders = fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const folder of folders) {
    const folderPath = path.join(dataDir, folder);
    archive.directory(folderPath, folder); // keep folder name inside zip
  }

  await archive.finalize();
}
