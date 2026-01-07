"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface PreviewModalProps {
  open: boolean;
  content: string;
  onClose: () => void;
}

const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
const urlRegex = /(https?:\/\/[^\s]+)/g;

export function PreviewModal({ open, content, onClose }: PreviewModalProps) {
  if (!open) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const renderLine = (line: string, index: number) => {
    // For empty lines, render a line break to preserve spacing
    if (!line.trim()) {
      return <br key={index} />;
    }

    const parts = line.split(imageRegex);

    return (
      <div key={index} className="leading-relaxed mb-2">
        {parts.map((part, i) => {
          if (imageRegex.test(part)) {
            // This part is an image URL
            return (
              <Image
                key={i}
                src={part}
                alt="Preview image"
                width={800}
                height={500}
                className="max-w-full rounded my-2 block"
                unoptimized
              />
            );
          }

          // This part is regular text, which may contain links
          if (!part) return null;

          const textParts = part.split(urlRegex);
          return textParts.map((textPart, j) => {
            if (urlRegex.test(textPart)) {
              // Reset regex index to avoid issues with stateful global regex
              urlRegex.lastIndex = 0;
              return (
                <a
                  key={`${i}-${j}`}
                  href={textPart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {textPart}
                </a>
              );
            }
            urlRegex.lastIndex = 0;
            return <span key={`${i}-${j}`}>{textPart}</span>;
          });
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative w-[90%] h-[90%] bg-white overflow-hidden rounded">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Preview File Content</h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-sm overflow-auto h-[calc(100%-64px)]">
          {content.split("\n").map(renderLine)}
        </div>
      </div>
    </div>
  );
}
