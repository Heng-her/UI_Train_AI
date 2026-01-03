import { FormEvent, useEffect, useState } from "react";
import { TextAreaField } from "./TextAreaField";
import { useAlert } from "@/components/AlertProvider";
import { PreviewModal } from "@/components/PreviewModal";
const formatWithDash = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (l.startsWith("-") ? l : `- ${l}`))
    .join("\n");

export function FileForm({ folder }: { folder: string }) {
  const [fileName, setFileName] = useState("");
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  const [main, setMain] = useState("");
  const [highlights, setHighlights] = useState("");
  const [visitor, setVisitor] = useState("");
  const [tips, setTips] = useState("");
  const [why, setWhy] = useState("");
  const [images, setImages] = useState("");
  const alert = useAlert();
  const [showPreview, setShowPreview] = useState(false);

  const buildPreviewContent = () => `
${main}

Key Highlights:
${formatWithDash(highlights)}

Visitor Information:
${formatWithDash(visitor)}

Tips:
${formatWithDash(tips)}

Why Visit:
${formatWithDash(why)}

Images:
${formatWithDash(images)}
`;
  // 👇 Load files when folder changes
  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch(`/api/get-files?folder=${folder}`);
      const data = await res.json();
      setExistingFiles(data.files || []);
    };

    fetchFiles();
  }, [folder]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!fileName.trim()) return;

    const normalized = `${fileName}.txt`;

    // ✅ FRONTEND DUPLICATE CHECK
    if (
      existingFiles.some((f) => f.toLowerCase() === normalized.toLowerCase())
    ) {
      // alert(`File "${fileName}" already exists`);
      alert.error(`Error`, `File "${fileName}" already exists`);
      return;
    }

    const content = `
${main}

Key Highlights:
${formatWithDash(highlights)}

Visitor Information:
${formatWithDash(visitor)}

Tips:
${formatWithDash(tips)}

Why Visit:
${formatWithDash(why)}

Images:
${formatWithDash(images)}
`;

    const res = await fetch("/api/create-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName: folder, fileName, content }),
    });

    const data = await res.json();

    if (!res.ok) {
      // alert(data.error); // backend safety
      alert.error("Error", data.error);
      return;
    }

    // alert("File created successfully");
    alert.success("Success", "File created successfully");

    setFileName("");
    setMain("");
    setHighlights("");
    setVisitor("");
    setTips("");
    setWhy("");
    setImages("");
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-6">
        {/* Header & Filename Section */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h2 className="text-lg font-bold text-blue-900">
            Create New File in{" "}
            <span className="text-blue-600 underline decoration-2 offset-4">
              {folder}
            </span>
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-blue-800">Filename</label>
            <div className="relative">
              <input
                value={fileName}
                onChange={(e) =>
                  setFileName(e.target.value.replace(/\s+/g, "").toLowerCase())
                }
                placeholder="e.g. travel_guide"
                className="w-full pl-3 pr-12 py-2.5 bg-white border border-blue-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
                .txt
              </span>
            </div>
            <p className="text-[11px] text-blue-500 italic">
              Auto-formatted: lowercase, no spaces
            </p>
          </div>
        </div>

        {/* Main Content (Large Area) */}
        <TextAreaField
          label="📄 Main Description"
          value={main}
          onChange={setMain}
          placeholder="Write the primary description here..."
          txtfoooter="This is the opening paragraph that introduces the topic."
        />

        {/* Grid for Detailed Info */}
        <div className="grid">
          <TextAreaField
            label="✨ Key Highlights"
            value={highlights}
            onChange={setHighlights}
            placeholder={`Write the main introduction paragraph here... 
- e.g Key Highlights  
- e.g Key Highlights 
            `}
            txtfoooter="Press ⏎ (Enter) to create a new line"
          />
          <TextAreaField
            label="📍 Visitor Information"
            value={visitor}
            onChange={setVisitor}
            placeholder={`Enter a key highlight...
- e.g Enter a key highlight...
- e.g Enter a key highlight...`}
          />
          <TextAreaField
            label="💡 Tips for Visiting "
            value={tips}
            onChange={setTips}
            placeholder={`Pro tips for travelers...
- e.g Pro tips for travelers...
- e.g Pro tips for travelers...
            `}
          />
          <TextAreaField
            label="❓ Why Visit"
            value={why}
            onChange={setWhy}
            placeholder={`Unique selling points...
- e.g Unique selling points...
- e.g Unique selling points...
            `}
          />
        </div>

        <TextAreaField
          label="🖼️ Image URLs"
          value={images}
          onChange={setImages}
          placeholder={`Paste one URL per line...
- e.g Paste one URL per line.jpg
- e.g Paste one URL per line.jpg
          `}
          required={false}
        />

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="w-full border border-gray-300 hover:bg-gray-50 font-semibold py-3 rounded-xl"
          >
            👁 Preview Text
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-xl"
          >
            💾 Save File to {folder}
          </button>
        </div>
      </form>
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        content={buildPreviewContent()}
      />
    </>
  );
}
