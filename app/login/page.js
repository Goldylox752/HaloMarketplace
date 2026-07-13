import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
  };
}) {


  async function login(formData: FormData) {
    "use server";


    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";


    const supabase = await createClient();


    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });



    if (error) {

      redirect(
        `/login?error=${encodeURIComponent(
          "Invalid email or password"
        )}`
      );

    }



    redirect("/dashboard");

  }



  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">


      <div className="w-full max-w-md bg-white rounded-3xl shadow p-10">


        <div className="text-center">


          <Link
            href="/"
            className="text-2xl font-bold"
          >
            Halo<span className="text-indigo-600">.</span>
          </Link>



          <h1 className="mt-8 text-3xl font-bold">
            Welcome Back
          </h1>


          <p className="mt-3 text-gray-500">
            Login to your Halo Marketplace account.
          </p>


        </div>




        {searchParams.error && (

          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">

            {searchParams.error}

          </div>

        )}






        <form
          action={login}
          className="mt-8 space-y-5"
        >



          <div>

            <label className="text-sm font-medium">
              Email
            </label>


            <input

              name="email"

              type="email"

              required

              placeholder="you@email.com"

              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"

            />

          </div>






          <div>


            <div className="flex justify-between">

              <label className="text-sm font-medium">
                Password
              </label>


              <Link

                href="/forgot-password"

                className="text-sm text-indigo-600"

              >

                Forgot?

              </Link>


            </div>



            <input

              name="password"

              type="password"

              required

              placeholder="Your password"

              className="mt-2 w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"

            />


          </div>







          <button

            type="submit"

            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold text-lg transition"

          >

            Login

          </button>




        </form>







        <div className="mt-8 text-center">


          <p className="text-gray-500">

            Don't have an account?

          </p>



          <Link

            href="/signup"

            className="mt-2 inline-block font-bold text-indigo-600"

          >

            Create Account

          </Link>


        </div>




      </div>


    </main>

  );

}