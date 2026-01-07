import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  content?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        const { folderName, fileName } = req.query as {
            folderName?: string;
            fileName?: string;
        };

        if (!folderName || !fileName) {
            return res
                .status(400)
                .json({ error: "Folder name and file name are required" });
        }

        const filePath = path.join(process.cwd(), "data", folderName, String(fileName));

        try {
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: "File not found" });
            }

            const content = fs.readFileSync(filePath, "utf-8");
            res.status(200).json({ content });
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
