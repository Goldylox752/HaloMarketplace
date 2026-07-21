"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ?? null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  const links = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/browse" },
    { name: "Sell", href: "/sell" },
    ...(user
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Messages", href: "/messages" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-3xl font-black">
          Halo<span className="text-indigo-600">.</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "text-indigo-600"
                  : "hover:text-indigo-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border px-5 py-2 font-semibold hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg border px-3 py-2 lg:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold ${
                  pathname === link.href
                    ? "text-indigo-600"
                    : "hover:text-indigo-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr />

            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>

                <button
                  onClick={handleLogout}
                  className="text-left font-semibold text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-semibold hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-center font-bold text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}