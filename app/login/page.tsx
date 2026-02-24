"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await signIn("credentials", { email, password, callbackUrl, redirect: false });
    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <form action={onSubmit} className="w-full space-y-4 rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <Input name="email" type="email" placeholder="admin@example.com" required />
        <Input name="password" type="password" placeholder="********" required />
        <Button className="w-full" type="submit">Sign in</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
