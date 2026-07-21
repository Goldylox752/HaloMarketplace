import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Don't show header on auth pages (login, signup, forgot-password, reset-password)
  const authPages = ["/login", "/signup", "/forgot-password", "/reset-password"];
  if (authPages.includes(pathname)) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            Halo<span className="text-indigo-600">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`font-medium ${pathname === "/" ? "text-indigo-600" : "hover:text-indigo-600"}`}>
              Home
            </Link>
            {user && (
              <Link href="/dashboard" className={`font-medium ${pathname === "/dashboard" ? "text-indigo-600" : "hover:text-indigo-600"}`}>
                Dashboard
              </Link>
            )}
            {user && (
              <Link href="/messages" className={`font-medium ${pathname === "/messages" ? "text-indigo-600" : "hover:text-indigo-600"}`}>
                Messages
              </Link>
            )}
            <Link href="/sell" className={`font-medium ${pathname === "/sell" ? "text-indigo-600" : "hover:text-indigo-600"}`}>
              Sell
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="font-medium hover:text-indigo-600">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-gray-50 font-medium">
              Home
            </Link>
            {user && (
              <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-50 font-medium">
                Dashboard
              </Link>
            )}
            {user && (
              <Link href="/messages" className="block px-3 py-2 rounded-lg hover:bg-gray-50 font-medium">
                Messages
              </Link>
            )}
            <Link href="/sell" className="block px-3 py-2 rounded-lg hover:bg-gray-50 font-medium">
              Sell
            </Link>
            <hr className="my-2" />
            {isLoading ? (
              <div className="px-3 py-2 text-gray-500">Loading...</div>
            ) : user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600">{user.email}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 hover:bg-gray-50 rounded-lg font-medium">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
```

---

📁 2. Add Header to Layout – app/layout.js

Update your root layout to include the Header component:

```jsx
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}