import Link from "next/link";


export default function Navbar() {

  return (

    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


        {/* LOGO */}

        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
        >
          Halo Market
        </Link>



        {/* DESKTOP NAV */}

        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">


          <Link
            href="/marketplace"
            className="hover:text-indigo-600"
          >
            Marketplace
          </Link>


          <Link
            href="/products"
            className="hover:text-indigo-600"
          >
            Products
          </Link>


          <Link
            href="/categories"
            className="hover:text-indigo-600"
          >
            Categories
          </Link>


          <Link
            href="/sell"
            className="hover:text-indigo-600"
          >
            Sell
          </Link>


          <Link
            href="/seller"
            className="hover:text-indigo-600"
          >
            Seller Center
          </Link>


          <Link
            href="/support"
            className="hover:text-indigo-600"
          >
            Support
          </Link>


        </nav>




        {/* ACCOUNT */}

        <div className="hidden items-center gap-3 lg:flex">


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


        </div>



        {/* MOBILE BUTTON */}

        <button
          className="rounded-lg border px-3 py-2 lg:hidden"
        >
          ☰
        </button>



      </div>



    </header>

  );

}