import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import FavoriteButton from "@/components/FavoriteButton";
import CheckoutButton from "@/components/CheckoutButton";

async function getProduct(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id (
        username,
        avatar,
        location,
        rating,
        review_count,
        verified
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

        {/* Image */}

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              width={900}
              height={900}
              priority
              className="w-full h-[600px] object-cover"
            />
          ) : (
            <div className="h-[600px] flex items-center justify-center bg-gray-100 text-8xl">
              📦
            </div>
          )}

        </div>

        {/* Details */}

        <div className="bg-white rounded-3xl shadow p-10">

          <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
            {product.category || "General"}
          </span>

          <h1 className="text-5xl font-black mt-5">
            {product.title}
          </h1>

          <p className="text-4xl font-black text-indigo-600 mt-6">
            {formatPrice(product.price)}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 text-gray-500">

            <span>
              📍 {product.location || "Canada"}
            </span>

            <span>
              📦 {product.condition || "Used"}
            </span>

            {product.created_at && (
              <span>
                🗓 Posted {formatDate(product.created_at)}
              </span>
            )}

          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">
              Description
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              {product.description || "No description provided."}
            </p>
          </div>

          {/* Seller */}

          <div className="mt-10 border rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Seller
              </h2>

              {product.profiles?.verified && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                  ✓ Verified
                </span>
              )}

            </div>

            <div className="mt-5">

              <p className="text-lg font-semibold">
                {product.profiles?.username || "Halo Seller"}
              </p>

              <p className="text-gray-500 mt-1">
                📍 {product.profiles?.location || product.location || "Canada"}
              </p>

              <p className="mt-2">
                ⭐ {product.profiles?.rating ?? "5.0"}{" "}
                ({product.profiles?.review_count ?? 0} reviews)
              </p>

            </div>

          </div>

          {/* Actions */}

          <div className="mt-10 space-y-4">

            <CheckoutButton
              productId={product.id}
            />

            <FavoriteButton
              productId={product.id}
            />

            <Link
              href={`/messages?seller=${product.seller_id}&product=${product.id}`}
              className="block w-full text-center border rounded-xl py-4 font-bold hover:bg-gray-100 transition"
            >
              💬 Message Seller
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}
