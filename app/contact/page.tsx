"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, SlideIn } from "@/components/ui/animations";

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
    <div className="mx-auto max-w-3xl px-4 py-16">
      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Get in Touch</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Have a question or want to work together? Drop me a message.</p>
      </FadeIn>

      <SlideIn delay={0.2} direction="up">
        <form action={onSubmit} className="mt-10 space-y-5 rounded-2xl border bg-card/80 backdrop-blur-sm p-8 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" placeholder="Your name" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" placeholder="you@example.com" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea name="message" placeholder="Write your message..." required className="rounded-xl min-h-[150px]" />
          </div>
          <Button
            type="submit"
            disabled={state === "loading"}
            className="w-full rounded-xl shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            {state === "loading" ? "Sending..." : "Send Message"}
          </Button>

          {state === "success" && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ Message sent successfully! I&apos;ll get back to you soon.</p>
            </div>
          )}
          {state === "error" && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center">
              <p className="text-sm font-medium text-destructive">Failed to send message. Please try again.</p>
            </div>
          )}
        </form>
      </SlideIn>
    </div>
  );
}
