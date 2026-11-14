"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-hero px-4">
      {/* Decorative blurs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-coral-400/10 rounded-full blur-3xl" />

      <div className="relative glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/logo-ceylon-aura.png"
            alt="Ceylon Aura Tours"
            width={160}
            height={60}
            className="mx-auto"
          />
          <h1 className="font-display text-2xl font-bold text-gray-900 mt-4">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your tours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
              placeholder="admin@yourdomain.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50/60 backdrop-blur-sm py-2 rounded-xl border border-red-200/50">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}