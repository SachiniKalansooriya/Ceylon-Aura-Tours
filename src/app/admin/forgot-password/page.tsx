"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiCheck, FiCheckCircle, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { PASSWORD_MAX, passwordError, passwordRules } from "@/lib/password-rules";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function post(url: string, body: object) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  }

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await post("/api/password-reset/request", { email });
      setStep("reset");
      setNotice(`If ${email} is an admin account, a 6-digit code has been sent to it. Check your inbox and spam folder.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ruleError = passwordError(password);
    if (ruleError) {
      setError(ruleError);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await post("/api/password-reset/verify", { email, code, password });
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-hero px-4 py-10">
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-coral-400/10 rounded-full blur-3xl" />

      <div className="relative glass-card p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/ceylon_elephant_tours_logo.png"
            alt="Logo"
            width={160}
            height={60}
            className="mx-auto"
          />
          <h1 className="font-display text-2xl font-bold text-gray-900 mt-4">
            {step === "done" ? "Password Changed" : "Reset Password"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === "email" && "Enter your admin email to get a reset code"}
            {step === "reset" && "Enter the code and choose a new password"}
            {step === "done" && "You can now sign in with your new password"}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={requestCode} className="space-y-5">
            <div>
              <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full"
                placeholder="admin@yourdomain.com"
                autoComplete="email"
                required
              />
            </div>

            {error && <ErrorBox message={error} />}

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 disabled:opacity-50">
              {loading ? "Sending code..." : "Send Code"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword} className="space-y-5">
            {notice && (
              <p className="text-sm text-gray-600 bg-white/50 p-3 rounded-xl border border-white/60">{notice}</p>
            )}

            <div>
              <label htmlFor="fp-code" className="block text-sm font-medium text-gray-700 mb-1">
                6-digit code
              </label>
              <input
                id="fp-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="glass-input w-full text-center text-2xl tracking-[0.5em] font-semibold"
                placeholder="••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="fp-password" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <div className="relative">
                <input
                  id="fp-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pr-11"
                  placeholder="Choose a strong password"
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX}
                  aria-describedby="fp-rules"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              <ul id="fp-rules" className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                {passwordRules.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-gray-500"}`}>
                      {ok ? <FiCheck className="w-3.5 h-3.5 shrink-0" /> : <FiX className="w-3.5 h-3.5 shrink-0 text-gray-400" />}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <label htmlFor="fp-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="fp-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="glass-input w-full pr-11"
                  placeholder="Type it again"
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>
              )}
            </div>

            {error && <ErrorBox message={error} />}

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 disabled:opacity-50">
              {loading ? "Saving..." : "Change Password"}
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(""); }}
                className="text-gray-500 hover:text-gray-700"
              >
                Use a different email
              </button>
              <button
                type="button"
                onClick={() => requestCode()}
                disabled={loading}
                className="text-primary-900 font-medium hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="text-center space-y-6">
            <FiCheckCircle className="w-14 h-14 text-green-500 mx-auto" />
            <Link href="/admin" className="w-full btn-primary justify-center py-3">
              Go to Sign In
            </Link>
          </div>
        )}

        {step !== "done" && (
          <Link
            href="/admin"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        )}
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="text-red-500 text-sm text-center bg-red-50/60 backdrop-blur-sm py-2 px-3 rounded-xl border border-red-200/50">
      {message}
    </p>
  );
}
