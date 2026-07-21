import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";


export const metadata = {

  title: "Halo Market | Buy & Sell Across Canada",

  description:
    "Halo Market is a modern Canadian marketplace where buyers and sellers connect to buy, sell, and discover products.",

};


export default function RootLayout({ children }) {

  return (

    <html lang="en">

      <body className="min-h-screen bg-gray-50 antialiased">

        <Navbar />

        <main>
          {children}
        </main>

        <Footer />

      </body>

    </html>

  );

}