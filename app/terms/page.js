export const metadata = {
  title: "Terms of Service | Halo Marketplace",
  description: "Halo Marketplace terms of service."
};


export default function TermsPage() {

  return (

    <main className="mx-auto max-w-3xl px-6 py-16">

      <h1 className="text-4xl font-black">
        Terms of Service
      </h1>


      <p className="mt-4 text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>



      <div className="mt-8 space-y-5 text-gray-700">


        <p>
          By using Halo Marketplace, you agree to these terms.
        </p>


        <ul className="
        list-disc
        space-y-3
        pl-6
        ">

          <li>
            Users must provide accurate information when creating listings.
          </li>

          <li>
            Users may not post illegal, fraudulent, or misleading content.
          </li>

          <li>
            Buyers and sellers must communicate respectfully.
          </li>

          <li>
            Halo Marketplace connects buyers and sellers but does not
            directly participate in private transactions.
          </li>

          <li>
            Users are responsible for their own purchases, sales,
            and agreements.
          </li>

        </ul>



        <p>
          Halo Marketplace reserves the right to suspend accounts that
          violate these terms.
        </p>


      </div>


    </main>

  );

}