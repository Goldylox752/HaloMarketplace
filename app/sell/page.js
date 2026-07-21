import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/SubmitButton"; // we'll create this client component

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const metadata = {
  title: "Sell Item | Halo Marketplace",
  description: "Create a listing and sell on Halo Marketplace.",
};

export default function SellPage({ searchParams }) {
  // Capture error from redirect query param (if any)
  const error = searchParams?.error || null;

  async function createProduct(formData) {
    "use server";

    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      redirect("/login");
    }

    // 2. Extract form fields
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const price = Number(formData.get("price"));
    const location = formData.get("location")?.toString().trim();
    const category = formData.get("category")?.toString();
    const condition = formData.get("condition")?.toString();
    const files = formData.getAll("images");

    // 3. Validate required fields
    if (!title || !price || !location || !category) {
      // Redirect back with error message
      redirect("/sell?error=All required fields must be filled.");
    }

    // 4. Upload images (handle multiple)
    let uploadedUrls = [];
    const bucket = "product-images";
    const userPrefix = user.id;

    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${userPrefix}/${crypto.randomUUID()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, { contentType: file.type });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Continue with other files instead of failing completely
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }
    }

    if (uploadedUrls.length === 0) {
      redirect("/sell?error=Please upload at least one image.");
    }

    // 5. Generate unique slug
    const slug = `${createSlug(title)}-${Date.now()}`;

    // 6. Insert product into database
    const { error: insertError } = await supabase
      .from("products")
      .insert({
        user_id: user.id,          // match your actual column name
        title,
        slug,
        description,
        price,
        location,
        category,
        condition,
        image: uploadedUrls[0],     // first as main
        images: uploadedUrls,       // array of all URLs
        status: "active",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      redirect("/sell?error=Failed to create listing. Please try again.");
    }

    // 7. Success – redirect to the new product page
    redirect(`/product/${slug}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-10 shadow">
          <h1 className="text-4xl font-black">Sell on Halo Marketplace</h1>
          <p className="mt-3 text-gray-600">
            Create your listing and connect with buyers.
          </p>

          {/* Display error if present */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-red-700 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <form action={createProduct} encType="multipart/form-data" className="mt-10 space-y-5">
            <input
              name="title"
              required
              placeholder="Product title"
              className="w-full rounded-xl border p-4"
            />
            <input
              name="price"
              type="number"
              required
              placeholder="Price CAD"
              className="w-full rounded-xl border p-4"
            />
            <input
              name="location"
              required
              placeholder="City / Province"
              className="w-full rounded-xl border p-4"
            />
            <select name="category" required className="w-full rounded-xl border p-4">
              <option value="">Select Category</option>
              <option>Vehicles</option>
              <option>Electronics</option>
              <option>Computers</option>
              <option>Home</option>
              <option>Fashion</option>
              <option>Gaming</option>
              <option>Tools</option>
              <option>Sports</option>
              <option>Services</option>
            </select>
            <select name="condition" required className="w-full rounded-xl border p-4">
              <option value="">Select Condition</option>
              <option>New</option>
              <option>Like New</option>
              <option>Used</option>
              <option>Refurbished</option>
            </select>
            <textarea
              name="description"
              required
              rows="6"
              placeholder="Describe your item..."
              className="w-full rounded-xl border p-4"
            />
            <label className="font-bold">Photos</label>
            <input
              name="images"
              type="file"
              multiple
              accept="image/*"
              required
              className="w-full rounded-xl border p-4"
            />
            {/* Use SubmitButton with loading state */}
            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  );
}