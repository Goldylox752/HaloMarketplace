import Link from "next/link";


export default function Navbar() {

  const links = [
    {
      name: "Marketplace",
      href: "/marketplace",
    },
    {
      name: "Products",
      href: "/products",
    },
    {
      name: "Categories",
      href: "/categories",
    },
    {
      name: "Sell",
      href: "/sell",
    },
    {
      name: "Seller Center",
      href: "/seller",
    },
    {
      name: "Support",
      href: "/support",
    },
  ];


  const accountLinks = [
    {
      name: "❤️ Favourites",
      href: "/favourites",
    },
    {
      name: "💬 Messages",
      href: "/messages",
    },
    {
      name: "📦 Orders",
      href: "/orders",
    },
    {
      name: "📊 Dashboard",
      href: "/dashboard",
    },
  ];


  return (

    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">


      <div className="mx-auto max-w-7xl px-6 py-4">


        <div className="flex items-center justify-between">


          {/* LOGO */}

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Halo Market
          </Link>



          {/* DESKTOP LINKS */}

          <nav className="hidden items-center gap-6 lg:flex">

            {links.map((link) => (

              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold transition hover:text-indigo-600"
              >
                {link.name}
              </Link>

            ))}

          </nav>




          {/* ACCOUNT BUTTONS */}

          <div className="hidden items-center gap-3 lg:flex">


            <Link
              href="/login"
              className="rounded-xl border px-5 py-2 font-semibold transition hover:bg-gray-100"
            >
              Login
            </Link>


            <Link
              href="/signup"
              className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white transition hover:bg-indigo-700"
            >
              Sign Up
            </Link>


          </div>



          {/* MOBILE */}

          <button
            aria-label="Open menu"
            className="rounded-lg border px-3 py-2 lg:hidden"
          >
            ☰
          </button>


        </div>




        {/* ACCOUNT MENU */}

        <div className="mt-4 hidden gap-5 border-t pt-4 text-sm lg:flex">

          {accountLinks.map((link) => (

            <Link
              key={link.href}
              href={link.href}
              className="font-semibold text-gray-600 hover:text-indigo-600"
            >
              {link.name}
            </Link>

          ))}

        </div>


      </div>


    </header>

  );

}