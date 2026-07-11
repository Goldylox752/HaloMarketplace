export default function Footer() {

  return (

    <footer className="bg-gray-900 text-white">


      <div className="max-w-7xl mx-auto px-6 py-12">


        <div className="grid gap-10 md:grid-cols-4">


          <div>

            <h2 className="text-2xl font-bold">
              Halo Marketplace
            </h2>


            <p className="mt-4 text-gray-400">

              Canada's next generation AI-powered
              marketplace platform.

            </p>


          </div>



          <div>

            <h3 className="font-bold">
              Marketplace
            </h3>


            <ul className="mt-4 space-y-2 text-gray-400">

              <li>
                Browse Products
              </li>

              <li>
                Sell Items
              </li>

              <li>
                Categories
              </li>

            </ul>


          </div>




          <div>

            <h3 className="font-bold">
              Company
            </h3>


            <ul className="mt-4 space-y-2 text-gray-400">

              <li>
                About
              </li>

              <li>
                Careers
              </li>

              <li>
                Contact
              </li>


            </ul>


          </div>




          <div>

            <h3 className="font-bold">
              Support
            </h3>


            <ul className="mt-4 space-y-2 text-gray-400">

              <li>
                Help Center
              </li>

              <li>
                Privacy
              </li>

              <li>
                Terms
              </li>


            </ul>


          </div>


        </div>



        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500">


          © {new Date().getFullYear()} Halo Marketplace.
          All rights reserved.


        </div>


      </div>


    </footer>

  );

}
