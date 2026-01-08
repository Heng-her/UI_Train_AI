"use client";

import { useFolders } from "@/hooks/useFolders";
import { FolderSelector } from "@/components/FolderSelector";
import { FileForm } from "@/components/FileForm";
import { useEffect, useState } from "react";
// import { useAlert } from "@/components/AlertProvider";
import {
  Users,
  Monitor,
  Clock,
  FolderOpen,
  Zap,
  Download,
  Globe,
} from "lucide-react";
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Me() {
  const [viewerCount, setViewerCount] = useState(0);
  const [viewersData, setViewersData] = useState<any[]>([]); // New state variable

  useEffect(() => {
    const todayDateString = getTodayDateString(); // Get today's date in YYYY-MM-DD format
    fetch("/api/viewer")
      .then((res) => res.json())
      .then((data) => {
        const filteredViewers = data.viewers.filter((viewer: any) => {
          const lastActiveDate = new Date(viewer.session.lastActiveAt);
          const lastActiveDateString = `${lastActiveDate.getFullYear()}-${String(
            lastActiveDate.getMonth() + 1
          ).padStart(2, "0")}-${String(lastActiveDate.getDate()).padStart(
            2,
            "0"
          )}`;
          return lastActiveDateString === todayDateString;
        });
        setViewerCount(filteredViewers.length);
        setViewersData(filteredViewers);
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
const parseUA = (ua: string) => {
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Macintosh")) return "macOS";
    return "Mobile/Other";
  };
  return (
    /* 1. Added 'flex', 'items-center', and 'justify-center' to the parent */
    <main className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER & ANALYTICS SUMMARY */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Console
            </h1>
            <p className="text-slate-500">
              Manage your folders and monitor live traffic.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 min-w-50">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Today&apos;s Viewers
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {viewerCount}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: VIEWER FEED */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Globe size={18} className="text-slate-400" />
                Live Activity
              </h2>
            </div>

            <div className="grid gap-4">
              {viewersData.length > 0 ? (
                viewersData.map((viewer, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            viewer.visibility.state === "visible"
                              ? "bg-green-500 animate-pulse"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-xs font-mono text-slate-500">
                          {viewer.viewerId.slice(0, 13)}...
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {Math.round(viewer.session.durationSeconds / 60)}m
                        session
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
                          Journey Path
                        </p>
                        <div className="space-y-2">
                          {viewer.pages?.map((page: any, pIdx: number) => (
                            <div
                              key={pIdx}
                              className="flex items-start gap-2 group"
                            >
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full border border-slate-300 group-last:bg-blue-500 group-last:border-blue-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">
                                  {page.route === "/" ? "Home" : page.route}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {new Date(
                                    page.timestamp
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 flex items-center gap-2">
                            <Monitor size={14} /> OS
                          </span>
                          <span className="font-medium">
                            {parseUA(viewer.device.userAgent)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 flex items-center gap-2">
                            <Globe size={14} /> Lang
                          </span>
                          <span className="font-medium uppercase">
                            {viewer.device.language}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 truncate">
                          {viewer.device.userAgent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                  <p className="text-slate-400">
                    Waiting for today&apos;s visitors...
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: CONTROLS */}
          <section className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FolderOpen size={18} className="text-blue-500" />
                Directory Manager
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-2 block">
                    Target Folder
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

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => exportFolder(selectedFolder)}
                    disabled={!selectedFolder || selectedFolder === "__new__"}
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white text-sm font-semibold py-2.5 rounded-lg transition-all"
                  >
                    <Download size={16} /> Export
                  </button>
                  <button
                    onClick={() => (window as any).autofillForm()}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm shadow-blue-100"
                  >
                    <Zap size={16} /> Autofill
                  </button>
                </div>
              </div>
            </div>

            {selectedFolder && selectedFolder !== "__new__" && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">
                  File Configuration
                </h3>
                <FileForm folder={selectedFolder} />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
