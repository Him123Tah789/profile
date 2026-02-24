"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="rounded-md border bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
}
