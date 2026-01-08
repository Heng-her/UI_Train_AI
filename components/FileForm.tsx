import { FormEvent, useCallback, useEffect, useState } from "react";
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

const parseContent = (content: string) => {
  const unformat = (text: string | undefined) => {
    if (!text) return "";
    return text
      .trim()
      .split("\n")
      .map((l) => l.replace(/^- /, "").trim())
      .filter(Boolean)
      .join("\n");
  };

  const main = unformat(content.split("Key Highlights:")[0]);

  const highlightsMatch = content.match(
    /Key Highlights:\s*([\s\S]*?)(?=Visitor Information:|$)/
  );
  const visitorMatch = content.match(
    /Visitor Information:\s*([\s\S]*?)(?=Tips:|$)/
  );
  const tipsMatch = content.match(/Tips:\s*([\s\S]*?)(?=Why Visit:|$)/);
  const whyMatch = content.match(/Why Visit:\s*([\s\S]*?)(?=Images:|$)/);
  const imagesMatch = content.match(/Images:\s*([\s\S]*?)$/);

  return {
    main,
    highlights: unformat(highlightsMatch?.[1]),
    visitor: unformat(visitorMatch?.[1]),
    tips: unformat(tipsMatch?.[1]),
    why: unformat(whyMatch?.[1]),
    images: unformat(imagesMatch?.[1]),
  };
};

export function FileForm({ folder }: { folder: string }) {
  const [fileName, setFileName] = useState("");
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const [main, setMain] = useState("");
  const [highlights, setHighlights] = useState("");
  const [visitor, setVisitor] = useState("");
  const [tips, setTips] = useState("");
  const [why, setWhy] = useState("");
  const [images, setImages] = useState("");
  const alert = useAlert();
  const [showPreview, setShowPreview] = useState(false);

  const buildPreviewContent = useCallback(
    () => `
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
`,
    [main, highlights, visitor, tips, why, images]
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`/api/get-files?folder=${folder}`);
        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setExistingFiles(data.files || []);
      } catch {
        alert.error("Error", "Could not load files for this folder.");
        setExistingFiles([]);
      }
    };

    if (folder) {
      fetchFiles();
      // resetForm();
    }
  }, [folder, alert]);

  const resetForm = () => {
    setFileName("");
    setSelectedFile("");
    setIsEditing(false);
    setMain("");
    setHighlights("");
    setVisitor("");
    setTips("");
    setWhy("");
    setImages("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const file = e.target.value;
    setSelectedFile(file);

    if (file) {
      setIsEditing(true);
      setFileName(file.replace(/\.txt$/, ""));
      try {
        const res = await fetch(
          `/api/get-file-content?folderName=${folder}&fileName=${file}`
        );
        if (!res.ok) throw new Error("Failed to fetch file content");
        const data = await res.json();
        const parsed = parseContent(data.content);
        setMain(parsed.main);
        setHighlights(parsed.highlights);
        setVisitor(parsed.visitor);
        setTips(parsed.tips);
        setWhy(parsed.why);
        setImages(parsed.images);
      } catch (error) {
        alert.error("Error fetching file", (error as Error).message);
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const content = buildPreviewContent();

    try {
      if (isEditing) {
        // ----------- UPDATE LOGIC -----------
        const res = await fetch("/api/update-file", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folderName: folder,
            fileName: selectedFile,
            content,
          }),
        });

        if (fileName === null) return;

        const data = await res.json();

        if (!res.ok) {
          alert.error("Error", data.error || "Failed to update the file.");
          return;
        }

        alert.success("Success", "File updated successfully");
        // ✅ CLEAR TEXTAREAS & EXIT EDIT MODE
        resetForm();
      } else {
        // ----------- CREATE LOGIC -----------
        if (!fileName.trim()) {
          alert.error("Validation", "File name cannot be empty.");
          return;
        }

        const normalized = `${fileName}.txt`;

        if (
          existingFiles.some(
            (f) => f.toLowerCase() === normalized.toLowerCase()
          )
        ) {
          alert.error("Error", `File "${fileName}" already exists`);
          return;
        }

        const res = await fetch("/api/create-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderName: folder, fileName, content }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert.error("Error", data.error || "Failed to create the file.");
          return;
        }

        alert.success("Success", "File created successfully");
        setExistingFiles((prev) => [...prev, normalized].sort());
        resetForm();
      }
    } catch (error: unknown) {
      // Catches network errors or unexpected exceptions
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong.";
      alert.error("Unexpected Error", errorMessage);
      console.error("Submit error:", error);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-6">
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-blue-900">
              {isEditing ? "Edit File in" : "Create New File in"}{" "}
              <span className="text-blue-600 underline decoration-2 offset-4">
                {folder}
              </span>
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-semibold bg-blue-500 p-2 rounded-2xl text-white hover:bg-blue-300"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* File Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-blue-800">
              Select Existing File (Optional)
            </label>
            <select
              value={selectedFile}
              onChange={handleFileSelect}
              className="w-full p-2.5 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Create a new file --</option>
              {existingFiles.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>

          {/* Filename Input */}
          <div className="flex flex-col gap-1.5 mt-4">
            <label className="text-sm font-bold text-blue-800">Filename</label>
            <div className="relative">
              <input
                value={fileName}
                onChange={(e) =>
                  setFileName(
                    e.target.value
                      .toLowerCase() // lowercase
                      .replace(/\s+/g, "_") // spaces → underscore
                      .replace(/&/g, "_and_") // & → and
                      .replace(/[^a-z_]/g, "") // remove everything except a-z and _
                      .replace(/_+/g, "_") // collapse multiple underscores
                  )
                }
                placeholder="e.g. travel_guide"
                className="w-full pl-3 pr-12 py-2.5 bg-white border border-blue-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                disabled={isEditing}
              />

              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
                .txt
              </span>
            </div>
            <p className="text-[11px] text-blue-500 italic">
              {isEditing
                ? "Filename is locked during edit."
                : "Auto-formatted: lowercase, no spaces"}
            </p>
          </div>
        </div>

        <TextAreaField
          label="📄 Main Description"
          value={main}
          onChange={setMain}
          placeholder="Write the primary description here..."
          txtfoooter="This is the opening paragraph that introduces the topic."
        />

        <div className="grid">
          <TextAreaField
            label="✨ Key Highlights"
            value={highlights}
            onChange={setHighlights}
            placeholder={`Write the main introduction paragraph here...\n- e.g Key Highlights\n- e.g Key Highlights`}
            txtfoooter="Press ⏎ (Enter) to create a new line"
            classlabel="whitespace-nowrap"
          />
          <TextAreaField
            label="📍 Visitor Information"
            value={visitor}
            onChange={setVisitor}
            placeholder={`Enter a key highlight...\n- e.g Enter a key highlight...\n- e.g Enter a key highlight...`}
            classlabel="whitespace-nowrap"
          />
          <TextAreaField
            label="💡 Tips for Visiting "
            value={tips}
            onChange={setTips}
            placeholder={`Pro tips for travelers...\n- e.g Pro tips for travelers...\n- e.g Pro tips for travelers...`}
            classlabel="whitespace-nowrap"
          />
          <TextAreaField
            label="❓ Why Visit"
            value={why}
            onChange={setWhy}
            placeholder={`Unique selling points...\n- e.g Unique selling points...\n- e.g Unique selling points...`}
            classlabel="whitespace-nowrap"
          />
        </div>

        <TextAreaField
          label="🖼️ Image URLs (Optional) "
          value={images}
          onChange={setImages}
          placeholder={`Paste one URL per line...\n- e.g Paste one URL per line.jpg\n- e.g Paste one URL per line.jpg`}
          classlabel="whitespace-nowrap"
          required={false}
        />

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
            💾 {isEditing ? "Update File" : `Save File to ${folder}`}
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
