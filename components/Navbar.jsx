export default function Navbar() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        <h1 className="text-3xl font-black">
          Halo
        </h1>


        <div className="hidden md:flex flex-1 mx-10">

          <input
            placeholder="Search products, categories, brands..."
            className="w-full border rounded-full px-6 py-3"
          />

        </div>


        <nav className="flex gap-6">

          <a href="/products">
            Browse
          </a>

          <a href="/sell">
            Sell
          </a>

          <a href="/login">
            Account
          </a>

          <span>
            🛒
          </span>

        </nav>


      </div>

    </header>
  );
}
