import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getProduct(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function timeAgo(date) {
  const now = new Date();
  const posted = new Date(date);

  const hours = Math.floor((now - posted) / 1000 / 60 / 60);

  if (hours < 1) return "Just now";
  if (hours < 24)
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);

  if (days < 30)
    return `${days} day${days === 1 ? "" : "s"} ago`;

  return posted.toLocaleDateString("en-CA");
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | Halo Marketplace",
    };
  }

  return {
    title: `${product.title} | Halo Marketplace`,
    description:
      product.description ||
      `${product.title} available on Halo Marketplace.`,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-10">

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Marketplace
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">

          {/* LEFT COLUMN */}

          <div className="lg:col-span-2">

            {/* PRODUCT IMAGE */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

              <div className="relative aspect-square">

                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image Available
                  </div>
                )}

              </div>

            </div>

            {/* IMAGE THUMBNAILS */}

            <div className="mt-4 flex gap-3">

              {[1,2,3,4].map((item)=>(
                <div
                  key={item}
                  className="h-20 w-20 overflow-hidden rounded-xl border bg-white"
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              ))}

            </div>

            {/* DESCRIPTION */}

            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold">
                Description
              </h2>

              <p className="mt-5 whitespace-pre-line leading-8 text-gray-600">
                {product.description || "No description has been provided for this listing."}
              </p>

            </div>

            {/* PRODUCT DETAILS */}

            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold">
                Product Details
              </h2>

              <div className="grid grid-cols-2 gap-6 text-sm">

                <div>
                  <p className="text-gray-500">Condition</p>
                  <p className="font-semibold">
                    {product.condition || "Excellent"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-semibold">
                    {product.category || "General"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Brand</p>
                  <p className="font-semibold">
                    {product.brand || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-semibold">
                    {product.location || "Canada"}
                  </p>
                </div>

              </div>

            </div>
            {/* RELATED PRODUCTS */}

            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold">
                Similar Listings
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                More items you may be interested in.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {[1,2,3,4].map((item) => (

                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="relative aspect-square bg-gray-100">

                      {product.image_url ? (

                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-gray-400">
                          No Image
                        </div>

                      )}

                    </div>

                    <div className="p-4">

                      <p className="text-lg font-bold">
                        {formatPrice(product.price)}
                      </p>

                      <p className="mt-1 line-clamp-2 font-medium">
                        {product.title}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {product.location || "Canada"}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN */}

          <aside>

            <div className="sticky top-24 rounded-3xl border bg-white p-8 shadow-sm">

              <h1 className="text-3xl font-bold">
                {product.title}
              </h1>

              <p className="mt-4 text-4xl font-extrabold text-blue-600">
                {formatPrice(product.price)}
              </p>

              <div className="mt-6 space-y-3 text-gray-600">

                <div className="flex items-center gap-2">
                  📍
                  <span>{product.location || "Canada"}</span>
                </div>

                <div className="flex items-center gap-2">
                  🕒
                  <span>{timeAgo(product.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                  👁️
                  <span>142 Views</span>
                </div>

                <div className="flex items-center gap-2">
                  ❤️
                  <span>19 Saves</span>
                </div>

              </div>

              <div className="mt-8 space-y-3">

                <button className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700">

                  Contact Seller

                </button>

                <button className="w-full rounded-xl border py-4 font-semibold transition hover:bg-gray-50">

                  ❤️ Save Listing

                </button>

                <button className="w-full rounded-xl border py-4 font-semibold transition hover:bg-gray-50">

                  📤 Share Listing

                </button>

              </div>

              <div className="mt-8 rounded-2xl bg-green-50 p-5">

                <h3 className="font-bold text-green-700">
                  Buyer Protection
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-gray-600">

                  <li>✔ Verified Marketplace Listing</li>

                  <li>✔ Meet in a public place</li>

                  <li>✔ Inspect before paying</li>

                  <li>✔ Report suspicious listings</li>

                </ul>

              </div>

            </div>

            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">

              <h2 className="text-xl font-bold">
                Seller Information
              </h2>

              <div className="mt-6 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">

                  H

                </div>

                <div>

                  <p className="font-semibold">
                    Halo Marketplace Seller
                  </p>

                  <p className="text-sm text-gray-500">
                    ★★★★★ 4.9 Rating
                  </p>

                  <p className="text-sm text-gray-500">
                    Member since 2024
                  </p>

                  <p className="text-sm text-gray-500">
                    Usually replies within an hour
                  </p>

                </div>

              </div>

              <button className="mt-6 w-full rounded-xl border py-3 font-semibold transition hover:bg-gray-50">

                View Seller Profile

              </button>

            </div>
            {/* AI PRICE INSIGHTS */}

            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">

              <h2 className="text-xl font-bold">
                🤖 Halo AI Insights
              </h2>

              <div className="mt-5 space-y-4">

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="font-semibold text-green-700">
                    Great Price
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Based on similar listings, this price appears competitive.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="font-semibold text-blue-700">
                    Popular Category
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Items like this typically receive strong buyer interest.
                  </p>
                </div>

              </div>

            </div>

            {/* MARKETPLACE SAFETY */}

            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">

              <h2 className="text-xl font-bold">
                Marketplace Safety
              </h2>

              <ul className="mt-5 space-y-3 text-sm text-gray-600">

                <li>✅ Meet in a public place.</li>

                <li>✅ Inspect the item before paying.</li>

                <li>✅ Never send money in advance.</li>

                <li>✅ Use Halo Marketplace messaging whenever possible.</li>

              </ul>

            </div>

          </aside>

        </div>

      </div>

    </main>

  );
}
