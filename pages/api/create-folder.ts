import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  message?: string;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { folderName } = req.body as { folderName?: string };

    if (!folderName) return res.status(400).json({ error: "Folder name is required" });

    const dataPath = path.join(process.cwd(), "data");
    const folderPath = path.join(dataPath, folderName);

    try {
      if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

      if (fs.existsSync(folderPath)) {
        return res.status(400).json({ error: `Folder "${folderName}" already exists` });
      }

      fs.mkdirSync(folderPath);

      res.status(200).json({ message: `Folder "${folderName}" created!` });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
