import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const dataFilePath = path.join(process.cwd(), "data", "viewer.json");

async function readData() {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(file);
  } catch {
    return { viewers: [] };
  }
}

async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end();
  }

  const data = await readData();

  if (req.method === "GET") {
    return res.status(200).json(data);
  }

  // POST → track viewer
  const {
    viewerId,
    page,
    device,
    activity,
    visibility,
    userId = null
  } = req.body;

  const now = new Date();

  let viewer = data.viewers.find((v: any) => v.viewerId === viewerId);

  if (!viewer) {
    viewer = {
      viewerId: viewerId ?? `anon-${crypto.randomUUID()}`,
      userId,
      type: userId ? "authenticated" : "anonymous",
      session: {
        startedAt: now.toISOString(),
        lastActiveAt: now.toISOString(),
        durationSeconds: 0
      },
      pages: [{ ...page, timestamp: now.toISOString() }],
      activity,
      visibility,
      device
    };
    data.viewers.push(viewer);
  } else {
    viewer.session.lastActiveAt = now.toISOString();
    
    // If 'pages' doesn't exist, create it from 'page'
    if (!viewer.pages) {
      viewer.pages = viewer.page ? [{ ...viewer.page, timestamp: viewer.session.startedAt }] : [];
      delete viewer.page;
    }

    const lastPage = viewer.pages[viewer.pages.length - 1];
    if (!lastPage || lastPage.route !== page.route) {
        viewer.pages.push({ ...page, timestamp: now.toISOString() });
    }

    viewer.activity = activity;
    viewer.visibility = visibility;
  }

  viewer.session.durationSeconds =
    Math.floor(
      (now.getTime() - new Date(viewer.session.startedAt).getTime()) / 1000
    );

  await writeData(data);

  res.status(200).json({ viewer });
}
