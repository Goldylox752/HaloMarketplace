import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect("/login?error=Invalid email or password");
    }

    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-10 rounded-2xl shadow max-w-md w-full">

        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back to Halo Marketplace.
        </p>

        <form action={login} className="mt-6 space-y-4">

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full border rounded-xl p-3"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold"
          >
            Login
          </button>

        </form>

        <p className="mt-6 text-center text-gray-500">
          Don't have an account?
        </p>

        <Link
          href="/signup"
          className="block mt-2 text-center font-semibold text-indigo-600"
        >
          Create Account
        </Link>

      </div>
    </main>
  );
}