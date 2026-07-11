import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";

export default function Home() {
  return (
    <main>

      <Hero />

      <FeaturedSection />

      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-5xl font-bold">
            Sell Anything.
            <br />
            Reach Anyone.
          </h2>

          <p className="mt-5 text-xl text-gray-600 max-w-3xl mx-auto">
            Create your seller account and start reaching
            customers across Canada.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <a
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700"
            >
              Become a Seller
            </a>

            <a
              href="/products"
              className="border border-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-white"
            >
              Browse Products
            </a>

          </div>

        </div>
      </section>

    </main>
  );
}
