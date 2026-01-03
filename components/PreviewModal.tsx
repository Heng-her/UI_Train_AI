"use client";

import React from "react";

interface PreviewModalProps {
  open: boolean;
  content: string;
  onClose: () => void;
}

export function PreviewModal({ open, content, onClose }: PreviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative w-[90%] h-[90%] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Preview File Content</h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 border rounded"
          >
            Close
          </button>
        </div>

        {/* Content (TXT-like preview) */}
        <pre className="p-6 whitespace-pre-wrap font-mono text-sm overflow-auto h-[calc(100vh-64px)]">
{content}
        </pre>
      </div>
    </div>
  );
}
