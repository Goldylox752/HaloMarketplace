import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";


export const metadata = {

  title: "Halo Marketplace | Canada's AI-Powered Marketplace",

  description:
    "Halo Marketplace is Canada's next-generation AI-powered marketplace. Buy, sell, discover products, connect with sellers, and shop securely.",

  keywords: [
    "Halo Marketplace",
    "Canada marketplace",
    "buy and sell Canada",
    "online marketplace",
    "AI shopping assistant",
    "ecommerce platform",
    "seller marketplace",
    "secure online shopping"
  ],

  authors: [
    {
      name: "Halo Marketplace"
    }
  ],

  creator: "Halo Marketplace",

  openGraph: {

    title:
      "Halo Marketplace | Buy & Sell Anything",

    description:
      "A smarter marketplace powered by AI, secure payments, and real-time connections.",

    type:
      "website",

  },

};


export default function RootLayout({ children }) {


  return (

    <html lang="en">


      <body className="min-h-screen flex flex-col">


        <Navbar />


        <main className="flex-1">

          {children}

        </main>



        <Footer />


        {/* AI Shopping Assistant */}

        <AIChatWidget />


      </body>


    </html>

  );

}
