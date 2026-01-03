import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Data = {
  folders?: string[];
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const dataPath = path.join(process.cwd(), 'data');

    try {
      if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

      const items = fs.readdirSync(dataPath, { withFileTypes: true });
      const folders = items.filter(item => item.isDirectory()).map(dir => dir.name);

      res.status(200).json({ folders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
