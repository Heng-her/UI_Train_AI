"use client";

import { useFolders } from "@/hooks/useFolders";
import { FolderSelector } from "@/components/FolderSelector";
import { FileForm } from "@/components/FileForm";
// import { useAlert } from "@/components/AlertProvider";

export default function Me() {
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
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value")?.set;
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
