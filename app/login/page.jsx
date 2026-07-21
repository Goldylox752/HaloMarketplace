"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const supabase = createClient();


  const errorMessage = searchParams.get("error");
  const message = searchParams.get("message");


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(errorMessage || "");



  async function login(e){

    e.preventDefault();

    setLoading(true);
    setError("");



    const {error} = await supabase.auth.signInWithPassword({

      email,
      password

    });



    if(error){

      setError(error.message);
      setLoading(false);
      return;

    }



    router.push("/dashboard");
    router.refresh();

  }





  return (

    <main className="
    min-h-screen
    bg-gray-50
    px-6
    py-16
    flex
    items-center
    justify-center
    ">


      <div className="
      w-full
      max-w-md
      rounded-3xl
      bg-white
      p-8
      shadow-xl
      ">


        <h1 className="
        text-3xl
        font-black
        ">
          Login
        </h1>


        {message && (

          <p className="
          mt-4
          rounded-xl
          bg-green-50
          p-3
          text-green-700
          ">
            {message}
          </p>

        )}



        {error && (

          <p className="
          mt-4
          rounded-xl
          bg-red-50
          p-3
          text-red-600
          ">
            {error}
          </p>

        )}




        <form
        onSubmit={login}
        className="
        mt-8
        space-y-4
        ">


          <input

          type="email"

          placeholder="Email address"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          className="
          w-full
          rounded-xl
          border
          p-4
          "

          required

          />




          <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          className="
          w-full
          rounded-xl
          border
          p-4
          "

          required

          />




          <button

          disabled={loading}

          className="
          w-full
          rounded-xl
          bg-black
          py-4
          font-black
          text-white
          disabled:opacity-50
          "

          >

          {loading ? "Logging in..." : "Login"}

          </button>



        </form>





        <div className="
        mt-6
        flex
        justify-between
        text-sm
        ">


          <Link
          href="/forgot-password"
          className="
          text-indigo-600
          font-bold
          ">
            Forgot password?
          </Link>



          <Link
          href="/signup"
          className="
          text-indigo-600
          font-bold
          ">
            Create account
          </Link>


        </div>



      </div>


    </main>

  );

}