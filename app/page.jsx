import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getProducts(search, category, location) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image,
      location,
      slug,
      category,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(12);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export const metadata = {
  title: "Halo Marketplace | Buy & Sell Across Canada",
  description:
    "Canada's modern online marketplace. Buy and sell electronics, vehicles, furniture, gaming, tools and more.",
};

function formatPrice(price) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(price || 0);
}

export default async function Home({ searchParams }) {
  const params = await searchParams;

  const search = params?.search || "";
  const category = params?.category || "";
  const location = params?.location || "";

  const products = await getProducts(
    search,
    category,
    location
  );

  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Vehicles", icon: "🚗" },
    { name: "Home", icon: "🏠" },
    { name: "Gaming", icon: "🎮" },
    { name: "Tools", icon: "🛠️" },
    { name: "Sports", icon: "⚽" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Halo Marketplace
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">

            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>

            <Link href="/browse" className="hover:text-indigo-600">
              Browse
            </Link>

            <Link href="/categories" className="hover:text-indigo-600">
              Categories
            </Link>

            <Link href="/stores" className="hover:text-indigo-600">
              Stores
            </Link>

            <Link href="/sell" className="hover:text-indigo-600">
              Sell
            </Link>

            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>

            <Link href="/messages" className="hover:text-indigo-600">
              Messages
            </Link>

            <Link href="/favorites" className="hover:text-indigo-600">
              Favorites
            </Link>

            <Link href="/support" className="hover:text-indigo-600">
              Support
            </Link>

            <Link href="/about" className="hover:text-indigo-600">
              About
            </Link>

            <Link href="/contact" className="hover:text-indigo-600">
              Contact
            </Link>

          </nav>

          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="rounded-xl border px-5 py-2 font-semibold hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-black px-5 py-2 font-semibold text-white hover:bg-gray-900"
            >
              Sign Up
            </Link>

          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            🇨🇦 Canada's Marketplace
          </span>

          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Buy, Sell & Discover
            <br />
            Anything Local.
          </h1>

          <p className="mt-8 max-w-2xl text-xl text-gray-300">
            Halo Marketplace helps Canadians buy and sell everything from
            electronics and vehicles to furniture, collectibles, tools,
            gaming gear and much more.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/sell"
              className="rounded-xl bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
            >
              Start Selling
            </Link>

            <Link
              href="/browse"
              className="rounded-xl border border-white px-8 py-4 font-bold transition hover:bg-white hover:text-black"
            >
              Browse Listings
            </Link>

          </div>

        </div>

      </section>
          {/* ================= SEARCH ================= */}

      <section className="-mt-10 px-6">

        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-xl">

          <form
            action="/"
            className="grid gap-4 md:grid-cols-4"
          >

            <input
              name="search"
              defaultValue={search}
              placeholder="Search products..."
              className="rounded-xl border px-5 py-4 outline-none"
            />


            <select
              name="category"
              defaultValue={category}
              className="rounded-xl border px-5 py-4"
            >

              <option value="">
                All Categories
              </option>

              {categories.map((cat) => (

                <option
                  key={cat.name}
                  value={cat.name}
                >
                  {cat.name}
                </option>

              ))}

            </select>



            <select
              name="location"
              defaultValue={location}
              className="rounded-xl border px-5 py-4"
            >

              <option value="">
                All Canada
              </option>

              <option value="Alberta">
                Alberta
              </option>

              <option value="Ontario">
                Ontario
              </option>

              <option value="British Columbia">
                British Columbia
              </option>

              <option value="Quebec">
                Quebec
              </option>

              <option value="Saskatchewan">
                Saskatchewan
              </option>

            </select>



            <button
              className="
              rounded-xl
              bg-black
              px-6
              py-4
              font-bold
              text-white
              hover:bg-gray-800
              "
            >
              Search
            </button>


          </form>

        </div>

      </section>





      {/* ================= QUICK LINKS ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">

            <h2 className="text-4xl font-black">
              Explore Halo Marketplace
            </h2>

            <p className="mt-3 text-gray-600">
              Everything you need to buy, sell, and manage your marketplace.
            </p>

          </div>



          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


            <Link
              href="/browse"
              className="
              rounded-3xl
              border
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:shadow-xl
              "
            >

              <div className="text-5xl">
                🛍️
              </div>

              <h3 className="mt-5 text-xl font-black">
                Browse Listings
              </h3>

              <p className="mt-3 text-gray-600">
                Find products from sellers across Canada.
              </p>

            </Link>



            <Link
              href="/sell"
              className="
              rounded-3xl
              border
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:shadow-xl
              "
            >

              <div className="text-5xl">
                ➕
              </div>

              <h3 className="mt-5 text-xl font-black">
                Sell Products
              </h3>

              <p className="mt-3 text-gray-600">
                Create listings and reach buyers.
              </p>

            </Link>




            <Link
              href="/stores"
              className="
              rounded-3xl
              border
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:shadow-xl
              "
            >

              <div className="text-5xl">
                🏪
              </div>

              <h3 className="mt-5 text-xl font-black">
                Seller Stores
              </h3>

              <p className="mt-3 text-gray-600">
                Discover trusted marketplace stores.
              </p>

            </Link>




            <Link
              href="/dashboard"
              className="
              rounded-3xl
              border
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:shadow-xl
              "
            >

              <div className="text-5xl">
                📊
              </div>

              <h3 className="mt-5 text-xl font-black">
                Dashboard
              </h3>

              <p className="mt-3 text-gray-600">
                Manage your listings and account.
              </p>

            </Link>


          </div>


        </div>

      </section>





      {/* ================= CATEGORIES ================= */}


      <section className="bg-white px-6 py-20">


        <div className="mx-auto max-w-7xl">


          <div className="flex items-center justify-between mb-10">


            <h2 className="text-4xl font-black">
              Shop Categories
            </h2>


            <Link
              href="/categories"
              className="font-bold text-indigo-600"
            >
              View All →
            </Link>


          </div>



          <div className="
          grid
          grid-cols-2
          gap-5
          md:grid-cols-3
          lg:grid-cols-6
          ">


            {categories.map((cat) => (

              <Link

                key={cat.name}

                href={`/?category=${cat.name}`}

                className="
                rounded-3xl
                border
                bg-gray-50
                p-8
                text-center
                transition
                hover:-translate-y-1
                hover:shadow-lg
                "

              >

                <div className="text-5xl">
                  {cat.icon}
                </div>


                <h3 className="mt-4 font-bold">
                  {cat.name}
                </h3>


              </Link>

            ))}


          </div>


        </div>


      </section>





      {/* ================= TRUST ================= */}


      <section className="bg-gray-100 px-6 py-16">

        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">


          {[
            ["🇨🇦","Canada Wide","Local buying and selling across Canada"],
            ["🔒","Secure","Safe accounts and marketplace tools"],
            ["⭐","Trusted","Connect with verified sellers"],
            ["⚡","Simple","List products quickly"]
          ].map(item => (

            <div
              key={item[1]}
              className="
              rounded-3xl
              bg-white
              p-8
              text-center
              "
            >

              <div className="text-4xl">
                {item[0]}
              </div>

              <h3 className="mt-4 text-xl font-black">
                {item[1]}
              </h3>

              <p className="mt-2 text-gray-600">
                {item[2]}
              </p>

            </div>

          ))}


        </div>

      </section>
          {/* ================= LATEST LISTINGS ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl">


          <div className="mb-10 flex items-center justify-between">

            <div>

              <h2 className="text-4xl font-black">
                Latest Listings
              </h2>

              <p className="mt-3 text-gray-600">
                Discover the newest products added to Halo Marketplace.
              </p>

            </div>


            <Link
              href="/browse"
              className="
              hidden
              rounded-xl
              border
              px-6
              py-3
              font-bold
              md:block
              hover:bg-gray-100
              "
            >
              View All →
            </Link>


          </div>





          {products.length === 0 ? (

            <div className="
            rounded-3xl
            bg-gray-100
            p-12
            text-center
            ">

              <div className="text-5xl">
                📦
              </div>


              <h3 className="
              mt-5
              text-2xl
              font-black
              ">

                No listings found

              </h3>


              <p className="
              mt-3
              text-gray-600
              ">

                Be the first seller on Halo Marketplace.

              </p>


              <Link
                href="/sell"
                className="
                mt-6
                inline-block
                rounded-xl
                bg-black
                px-8
                py-4
                font-bold
                text-white
                "
              >

                Create Listing

              </Link>


            </div>


          ) : (


            <div className="
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-4
            ">


              {products.map((product) => (

                <Link

                  key={product.id}

                  href={`/product/${product.slug}`}

                  className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  bg-white
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                  "

                >


                  {/* IMAGE */}

                  <div className="
                  relative
                  h-60
                  bg-gray-100
                  ">


                    {product.image ? (

                      <Image

                        src={product.image}

                        alt={product.title}

                        fill

                        className="
                        object-cover
                        transition
                        duration-300
                        group-hover:scale-105
                        "

                      />


                    ) : (


                      <div className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-6xl
                      ">

                        📦

                      </div>


                    )}


                  </div>





                  {/* DETAILS */}

                  <div className="p-6">


                    <div className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    ">


                      <span className="
                      rounded-full
                      bg-gray-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ">

                        {product.category || "General"}

                      </span>


                      <span className="
                      text-sm
                      text-gray-500
                      ">

                        ⭐ Verified

                      </span>


                    </div>





                    <h3 className="
                    truncate
                    text-lg
                    font-black
                    ">

                      {product.title}

                    </h3>





                    <p className="
                    mt-3
                    text-sm
                    text-gray-500
                    ">

                      📍 {product.location || "Canada"}

                    </p>





                    <p className="
                    mt-4
                    text-2xl
                    font-black
                    ">

                      {formatPrice(product.price)}

                    </p>



                    <button
                      className="
                      mt-5
                      w-full
                      rounded-xl
                      bg-black
                      py-3
                      font-bold
                      text-white
                      transition
                      group-hover:bg-gray-800
                      "
                    >

                      View Product

                    </button>


                  </div>


                </Link>


              ))}


            </div>


          )}


        </div>


      </section>





      {/* ================= HOW IT WORKS ================= */}


      <section className="bg-gray-100 px-6 py-20">


        <div className="mx-auto max-w-7xl">


          <h2 className="
          text-center
          text-4xl
          font-black
          ">

            How Halo Works

          </h2>




          <div className="
          mt-12
          grid
          gap-6
          md:grid-cols-4
          ">


            {[

              ["1","Find Products"],
              ["2","Message Sellers"],
              ["3","Complete Purchase"],
              ["4","Enjoy Your Item"]

            ].map(step => (


              <div

                key={step[0]}

                className="
                rounded-3xl
                bg-white
                p-8
                text-center
                "

              >


                <div className="
                text-5xl
                font-black
                ">

                  {step[0]}

                </div>


                <h3 className="
                mt-4
                text-xl
                font-bold
                ">

                  {step[1]}

                </h3>


              </div>


            ))}


          </div>


        </div>


      </section>
          {/* ================= SELLER CTA ================= */}

      <section className="bg-black px-6 py-24 text-white">

        <div className="mx-auto max-w-5xl text-center">

          <h2 className="
          text-5xl
          font-black
          md:text-6xl
          ">

            Ready to Sell on Halo?

          </h2>


          <p className="
          mx-auto
          mt-6
          max-w-2xl
          text-xl
          text-gray-300
          ">

            Create your free listing and connect with buyers across Canada.

          </p>



          <div className="
          mt-10
          flex
          flex-wrap
          justify-center
          gap-4
          ">


            <Link

              href="/sell"

              className="
              rounded-xl
              bg-white
              px-10
              py-4
              font-black
              text-black
              "

            >

              Create Listing

            </Link>




            <Link

              href="/browse"

              className="
              rounded-xl
              border
              border-white
              px-10
              py-4
              font-black
              "

            >

              Browse Marketplace

            </Link>


          </div>


        </div>


      </section>





      {/* ================= FOOTER ================= */}


      <footer className="bg-white border-t">


        <div className="
        mx-auto
        max-w-7xl
        px-6
        py-16
        ">


          <div className="
          grid
          gap-10
          md:grid-cols-4
          ">


            {/* BRAND */}


            <div>


              <Link

                href="/"

                className="
                text-2xl
                font-black
                "

              >

                Halo Marketplace

              </Link>



              <p className="
              mt-4
              text-gray-600
              ">

                Canada's modern marketplace for buying and selling locally.

              </p>


            </div>





            {/* MARKETPLACE */}


            <div>


              <h3 className="
              font-black
              ">

                Marketplace

              </h3>


              <div className="
              mt-5
              flex
              flex-col
              gap-3
              text-gray-600
              ">


                <Link href="/browse">
                  Browse Listings
                </Link>


                <Link href="/categories">
                  Categories
                </Link>


                <Link href="/stores">
                  Stores
                </Link>


                <Link href="/sell">
                  Sell
                </Link>


              </div>


            </div>





            {/* ACCOUNT */}


            <div>


              <h3 className="
              font-black
              ">

                Account

              </h3>


              <div className="
              mt-5
              flex
              flex-col
              gap-3
              text-gray-600
              ">


                <Link href="/login">
                  Login
                </Link>


                <Link href="/signup">
                  Create Account
                </Link>


                <Link href="/dashboard">
                  Dashboard
                </Link>


                <Link href="/messages">
                  Messages
                </Link>


                <Link href="/favorites">
                  Favorites
                </Link>


              </div>


            </div>





            {/* COMPANY */}


            <div>


              <h3 className="
              font-black
              ">

                Company

              </h3>


              <div className="
              mt-5
              flex
              flex-col
              gap-3
              text-gray-600
              ">


                <Link href="/about">
                  About
                </Link>


                <Link href="/support">
                  Support
                </Link>


                <Link href="/contact">
                  Contact
                </Link>


                <Link href="/privacy">
                  Privacy Policy
                </Link>


                <Link href="/terms">
                  Terms
                </Link>


              </div>


            </div>


          </div>





          <div className="
          mt-12
          border-t
          pt-8
          text-center
          text-sm
          text-gray-500
          ">


            © {new Date().getFullYear()} Halo Marketplace. All rights reserved.


          </div>



        </div>


      </footer>


    </main>
  );
}