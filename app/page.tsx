"use client";

import { useFolders } from "@/hooks/useFolders";
import { FolderSelector } from "@/components/FolderSelector";
import { FileForm } from "@/components/FileForm";
import { useEffect, useState } from "react";
// import { useAlert } from "@/components/AlertProvider";

export default function Home() {
  const {
    folders,
    selectedFolder,
    setSelectedFolder,
    newFolderName,
    // setNewFolderName,
    createFolder,
    exportFolder,
    handleNewFolderNameChange,
    exportAllFolders,
  } = useFolders();
  const [viewerCount, setViewerCount] = useState<number>(0);
  useEffect(() => {
    fetch("/api/viewer")
      .then((res) => res.json())
      .then((data) => {
        setViewerCount(data.viewers.length);
      })
      .catch(console.error);
  }, []);
  // const alert = useAlert();

  return (
    /* 1. Added 'flex', 'items-center', and 'justify-center' to the parent */
    <main className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      {/* 2. Added 'mx-auto' and 'w-full' to ensure it stays centered and responsive */}
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-500">📁</span> Folder Manager
          </h1>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {viewerCount}
          </h1>
        </div>

        <div className="space-y-6">
          <section className="flex space-x-2">
            <div className="grid w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Directory Location
              </label>
              <FolderSelector
                folders={folders}
                selectedFolder={selectedFolder}
                onSelect={setSelectedFolder}
                newFolderName={newFolderName}
                onNewNameChange={handleNewFolderNameChange}
                onCreate={createFolder}
              />
            </div>
            <button
              onClick={() => exportFolder(selectedFolder)}
              disabled={!selectedFolder || selectedFolder === "__new__"}
              className="bg-green-600 h-10 place-self-end hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-4 rounded-md transition-colors shadow-sm w-40"
            >
              export (zip)
            </button>
            <button
              onClick={exportAllFolders}
              disabled={folders.length === 0}
              className="bg-blue-600 h-10 place-self-end hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 rounded-md transition-colors shadow-sm w-56"
            >
              export ALL (zip)
            </button>
          </section>

          {selectedFolder && selectedFolder !== "__new__" && (
            <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <FileForm folder={selectedFolder} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
