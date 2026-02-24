"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setState("loading");
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setState(res.ok ? "success" : "error");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Contact</h1>
      <form action={onSubmit} className="space-y-4 rounded-lg border p-6">
        <Input name="name" placeholder="Your name" required />
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Textarea name="message" placeholder="Write your message" required />
        <Button type="submit" disabled={state === "loading"}>Send</Button>
        {state === "success" && <p className="text-sm text-green-600">Message sent.</p>}
        {state === "error" && <p className="text-sm text-red-600">Failed to send message.</p>}
      </form>
    </div>
  );
}
