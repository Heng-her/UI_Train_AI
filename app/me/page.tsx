"use client";

import { useFolders } from "@/hooks/useFolders";
import { FolderSelector } from "@/components/FolderSelector";
import { FileForm } from "@/components/FileForm";
import { useEffect, useState } from "react";
// import { useAlert } from "@/components/AlertProvider";

export default function Me() {
  const [viewerCount, setViewerCount] = useState(0);
  const [viewersData, setViewersData] = useState<any[]>([]); // New state variable

  useEffect(() => {
    fetch("/api/viewer")
      .then((res) => res.json())
      .then((data) => {
        setViewerCount(data.viewers.length);
        setViewersData(data.viewers); // Update new state variable
      })
      .catch(console.error);
  }, []);

  const {
    folders,
    selectedFolder,
    setSelectedFolder,
    newFolderName,
    // setNewFolderName,
    createFolder,
    exportFolder,
    handleNewFolderNameChange,
  } = useFolders();
  function autofillForm() {
    const rawInput = prompt(
      "Paste your full form content here (Main Description, Key Highlights, etc.):"
    );
    if (!rawInput) return;

    function setReactValue(el: HTMLTextAreaElement, value: string) {
      const setter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(el),
        "value"
      )?.set;
      setter?.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function extract(section: string) {
      if (!rawInput) return "";
      const regex = new RegExp(
        `\\*\\*${section} \\*\\*\\*[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`,
        "i"
      );
      const match = rawInput.match(regex);
      return match ? match[1].trim() : "";
    }

    const textareas =
      document.querySelectorAll<HTMLTextAreaElement>("textarea");

    if (textareas.length >= 6) {
      const sections = [
        "Main Description",
        "Key Highlights",
        "Visitor Information",
        "Tips for Visiting",
        "Why Visit",
        "Image URLs",
      ];

      sections.forEach((section, i) => {
        setReactValue(textareas[i], extract(section));
      });

      console.log("✅ Form auto-filled from prompt input");
    } else {
      console.warn("Not enough textareas found.");
    }
  }
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
          <div>
            <p className="text-sm text-gray-500">Total Viewers: {viewerCount}</p>
          </div>
        </div>

        {/* New section for displaying viewer details */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Viewer Details</h2>
          {viewersData.length > 0 ? (
            <div className="space-y-4">
              {viewersData.map((viewer, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-700">Viewer ID: <span className="font-normal text-gray-600">{viewer.viewerId}</span></p>
                  <p className="text-sm font-medium text-gray-700">Type: <span className="font-normal text-gray-600">{viewer.type}</span></p>
                  <p className="text-sm font-medium text-gray-700">Last Active: <span className="font-normal text-gray-600">{new Date(viewer.session.lastActiveAt).toLocaleString()}</span></p>
                  
                  <div>
                      <p className="text-sm font-medium text-gray-700 mt-2">Pages Visited:</p>
                      <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                          {viewer.pages ? (
                              viewer.pages.map((page, pageIndex) => (
                                  <li key={pageIndex} className="text-sm text-gray-600">
                                      <span className="font-semibold">{page.route}</span> at {new Date(page.timestamp).toLocaleTimeString()}
                                      <br />
                                      <a href={page.url} className="text-blue-500 hover:underline break-all" target="_blank" rel="noopener noreferrer">{page.url}</a>
                                  </li>
                              ))
                          ) : viewer.page ? (
                               <li className="text-sm text-gray-600">
                                  <span className="font-semibold">{viewer.page.route}</span>
                                  <br />
                                  <a href={viewer.page.url} className="text-blue-500 hover:underline break-all" target="_blank" rel="noopener noreferrer">{viewer.page.url}</a>
                              </li>
                          ) : null}
                      </ul>
                  </div>

                  <p className="text-sm font-medium text-gray-700 mt-2">User Agent: <span className="font-normal text-gray-600 break-all">{viewer.device.userAgent}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No viewer data available.</p>
          )}
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
              className="bg-green-600 h-10 place-self-end hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-4 rounded-md transition-colors shadow-sm w-32"
            >
              export (zip)
            </button>
            <button
              onClick={() => autofillForm()}
              className="bg-green-600 h-10 place-self-end hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-4 rounded-md transition-colors shadow-sm w-32"
            >
              Auto-fill
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
