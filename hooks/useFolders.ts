"use client";
import { useEffect, useState } from "react";

export function useFolders() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  const fetchFolders = async () => {
    try {
      const res = await fetch("/api/get-folders");
      const data = await res.json();
      if (data.folders) setFolders(data.folders);
    } catch (err) {
      console.error("Fetch folders failed", err);
    }
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;

    // ✅ FRONTEND CHECK
    if (folders.includes(name)) {
      alert(`Folder "${name}" already exists`);
      return;
    }

    const res = await fetch("/api/create-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName: name }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error); // backend message
      return;
    }

    setSelectedFolder(name);
    setNewFolderName("");
    fetchFolders();
  };

  useEffect(() => {
    fetchFolders();
    const interval = setInterval(fetchFolders, 5000);
    return () => clearInterval(interval);
  }, []);
const exportFolder = async (folderName: string) => {
  if (!folderName) {
    alert("No folder selected to export");
    return;
  }

  try {
    // Fetch the files from the backend
    const res = await fetch(`/api/export-folder?name=${encodeURIComponent(folderName)}`);
    if (!res.ok) throw new Error("Failed to fetch folder files");

    // Expect backend to return a ZIP file containing .txt files
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${folderName}.zip`; // Download as ZIP
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Export failed");
  }
};


  return {
    folders,
    selectedFolder,
    setSelectedFolder,
    newFolderName,
    setNewFolderName,
    createFolder,
    exportFolder
  };
}
