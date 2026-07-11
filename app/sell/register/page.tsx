"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// app/sell/register/page.tsx
// Seller account signup for Halo Marketplace.
// Collects: full name, email, password, store name.
// Wire the TODO below up to your real API route (e.g. app/api/sellers/route.ts)
// once you have one — for now it simulates a request so the UI is fully functional.

type FormState = {
  fullName: string;
  email: string;
  password: string;
  storeName: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function SellerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    storeName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name.";
    if (!form.email.trim()) {
      next.email = "Enter an email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Create a password.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (!form.storeName.trim()) next.storeName = "Enter a store name.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: replace with your real endpoint, e.g.:
      // const res = await fetch("/api/sellers/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error((await res.json()).message ?? "Something went wrong.");

      await new Promise((resolve) => setTimeout(resolve, 900)); // placeholder

      router.push("/sell");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        {/* Form column */}
        <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-1/2 lg:px-20">
          <div className="mx-auto w-full max-w-sm">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-gray-900"
            >
              Halo
            </Link>

            <h1 className="mt-8 text-2xl font-semibold tracking-tight text-gray-900">
              Create your seller account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Set up your storefront and start reaching buyers across Canada.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <Field
                label="Full name"
                type="text"
                autoComplete="name"
                value={form.fullName}
                error={errors.fullName}
                onChange={(v) => updateField("fullName", v)}
              />

              <Field
                label="Email"
                type="email"
                autoComplete="email"
                value={form.email}
                error={errors.email}
                onChange={(v) => updateField("email", v)}
              />

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={`w-full rounded-lg border px-3.5 py-2.5 pr-16 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-violet-500/40 ${
                      errors.password
                        ? "border-red-400"
                        : "border-gray-300 focus:border-violet-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password ? (
                  <p id="password-error" className="mt-1.5 text-xs text-red-600">
                    {errors.password}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-400">
                    At least 8 characters.
                  </p>
                )}
              </div>

              <Field
                label="Store name"
                type="text"
                autoComplete="organization"
                value={form.storeName}
                error={errors.storeName}
                onChange={(v) => updateField("storeName", v)}
                hint="This is how buyers will see you across Halo."
              />

              {submitError && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create seller account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have a seller account?{" "}
              <Link
                href="/login"
                className="font-medium text-gray-900 underline underline-offset-2"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Side panel */}
        <div className="relative hidden overflow-hidden bg-gray-900 lg:block lg:w-1/2">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 80% 75%, rgba(59,130,246,0.25), transparent 50%)",
            }}
            aria-hidden="true"
          />
          <div className="relative flex h-full flex-col justify-between p-14">
            <div />
            <div className="max-w-md">
              <p className="text-sm font-medium uppercase tracking-widest text-violet-300">
                Sell on Halo
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
                Your storefront, backed by an AI marketplace built for
                Canadian sellers.
              </h2>
              <ul className="mt-8 space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-violet-300">→</span>
                  List products in minutes
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-300">→</span>
                  Reach buyers across every province
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-300">→</span>
                  Secure payments, built in
                </li>
              </ul>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 Halo Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
  autoComplete,
  value,
  error,
  onChange,
  hint,
}: {
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-violet-500/40 ${
          error ? "border-red-400" : "border-gray-300 focus:border-violet-500"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
