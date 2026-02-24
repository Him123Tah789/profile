"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { FileUploader } from "@/components/admin/file-uploader";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "richtext" | "file";
  placeholder?: string;
};

type RecordLike = { id?: string; [key: string]: any };

export function CrudManager({
  title,
  endpoint,
  fields,
  pageSize = 10
}: {
  title: string;
  endpoint: string;
  fields: CrudField[];
  pageSize?: number;
}) {
  const [rows, setRows] = useState<RecordLike[]>([]);
  const [editing, setEditing] = useState<RecordLike | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("createdAt:desc");
  const [form, setForm] = useState<RecordLike>(() => Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""])));

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    const qs = new URLSearchParams({ q: search, page: String(page), limit: String(pageSize), sort });
    const res = await fetch(`${endpoint}?${qs.toString()}`);
    const data = await res.json();
    setRows(data.items || data);
    setTotal(data.total || (Array.isArray(data) ? data.length : 0));
  }

  async function submit() {
    const method = editing?.id ? "PATCH" : "POST";
    const url = editing?.id ? `${endpoint}/${editing.id}` : endpoint;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setEditing(null);
      setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""])));
      await load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  function edit(row: RecordLike) {
    setEditing(row);
    setForm(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Input className="max-w-xs" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="h-10 rounded-md border px-3 text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="title:asc">Title A-Z</option>
        </select>
        <Button variant="outline" onClick={load}>Refresh</Button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">{editing ? "Edit item" : "Create item"}</h2>
        <div className="grid gap-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea value={String(form[field.name] || "")} onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.value }))} />
              ) : field.type === "richtext" ? (
                <RichTextEditor value={String(form[field.name] || "")} onChange={(value) => setForm((s) => ({ ...s, [field.name]: value }))} />
              ) : field.type === "file" ? (
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder={field.placeholder || "File URL"}
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.value }))}
                  />
                  <FileUploader onUploaded={(url) => setForm((s) => ({ ...s, [field.name]: url }))} />
                  {form[field.name] ? (
                    <a href={String(form[field.name])} target="_blank" className="text-xs text-primary underline" rel="noreferrer">
                      Preview uploaded file
                    </a>
                  ) : null}
                </div>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.name])}
                  onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.checked }))}
                />
              ) : (
                <Input
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.placeholder}
                  value={String(form[field.name] ?? "")}
                  onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={submit}>{editing ? "Update" : "Create"}</Button>
          <Button variant="outline" onClick={() => setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""])))}>Reset</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{row.title || row.name || row.category || row.email}</td>
                <td className="px-3 py-2">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => edit(row)}>Edit</Button>
                    {row.id && <Button variant="destructive" onClick={() => remove(row.id)}>Delete</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
        <span className="text-sm">Page {page} / {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
