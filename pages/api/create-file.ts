import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  message?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { folderName, fileName, content } = req.body as {
      folderName?: string;
      fileName?: string;
      content?: string;
    };

    if (!folderName || !fileName) {
      return res
        .status(400)
        .json({ error: "Folder name and file name are required" });
    }

    const sanitizedFileName =
      fileName.replace(/\s+/g, "").toLowerCase() + ".txt";
    const folderPath = path.join(process.cwd(), "data", folderName);
    const filePath = path.join(folderPath, sanitizedFileName);

    try {
      // Ensure folder exists
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });

      // Check if file exists
      if (fs.existsSync(filePath)) {
        return res
          .status(400)
          .json({
            error: `File "${sanitizedFileName}" already exists in "${folderName}"`,
          });
      }

      fs.writeFileSync(filePath, content || "", "utf-8");

      res
        .status(200)
        .json({
          message: `File "${sanitizedFileName}" created in folder "${folderName}"`,
        });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
