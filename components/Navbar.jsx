export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">
          Halo Marketplace
        </h1>

        <div className="flex gap-4">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/login">Login</a>
        </div>
      </div>
    </nav>
  );
}
