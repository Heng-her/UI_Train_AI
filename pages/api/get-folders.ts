import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type FolderData = {
  name: string;
  count: number;
};

type Data = {
  folders?: FolderData[];
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const dataPath = path.join(process.cwd(), "data");

    try {
      if (!fs.existsSync(dataPath))
        fs.mkdirSync(dataPath, { recursive: true });

      const items = fs.readdirSync(dataPath, { withFileTypes: true });
      const folders = items
        .filter((item) => item.isDirectory())
        .map((dir) => {
          const dirPath = path.join(dataPath, dir.name);
          const files = fs
            .readdirSync(dirPath)
            .filter((file) =>
              fs.statSync(path.join(dirPath, file)).isFile()
            );
          return { name: dir.name, count: files.length };
        });

      res.status(200).json({ folders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
