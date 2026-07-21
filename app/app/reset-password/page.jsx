"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

export default function ResetPasswordPage() {

  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);


  useEffect(() => {

    let subscription;


    async function checkSession() {

      const {
        data:{
          session
        }
      } = await supabase.auth.getSession();


      if(session){

        setSession(session);
        setLoading(false);
        return;

      }


      const {
        data
      } = supabase.auth.onAuthStateChange(
        (event, session)=>{

          if(
            event === "PASSWORD_RECOVERY" ||
            event === "SIGNED_IN"
          ){

            setSession(session);
            setLoading(false);

          }


          if(event === "SIGNED_OUT"){

            setError(
              "Invalid or expired reset link."
            );

            setLoading(false);

          }

        }
      );


      subscription = data.subscription;

    }


    checkSession();


    return ()=>{

      subscription?.unsubscribe();

    };


  }, [supabase]);



  async function updatePassword(formData){

    const password =
      formData.get("password")?.toString();


    const confirmPassword =
      formData.get("confirmPassword")?.toString();



    if(!password || !confirmPassword){

      setError(
        "All fields are required."
      );

      return;

    }



    if(password.length < 6){

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }



    if(password !== confirmPassword){

      setError(
        "Passwords do not match."
      );

      return;

    }



    const {
      error
    } = await supabase.auth.updateUser({

      password

    });



    if(error){

      setError(
        "Unable to update password."
      );

      return;

    }



    await supabase.auth.signOut();


    router.push(
      "/login?message=Password updated successfully"
    );


  }



  if(loading){

    return (

      <main className="min-h-screen flex items-center justify-center">

        <p>
          Validating your reset link...
        </p>

      </main>

    );

  }



  if(!session){

    return (

      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow">

          <h1 className="text-2xl font-black text-red-600">
            Invalid Link
          </h1>


          <p className="mt-4 text-gray-600">
            {error || "The reset link is invalid or expired."}
          </p>


          <Link
            href="/forgot-password"
            className="mt-6 inline-block font-bold text-indigo-600"
          >
            Request New Link
          </Link>


        </div>

      </main>

    );

  }



  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">


      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow">


        <h1 className="text-3xl font-black">
          Create New Password
        </h1>


        {error && (

          <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-600">
            {error}
          </p>

        )}



        <form
          action={updatePassword}
          className="mt-6 space-y-4"
        >


          <input
            name="password"
            type="password"
            placeholder="New password"
            className="w-full rounded-xl border px-4 py-3"
            required
          />


          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-xl border px-4 py-3"
            required
          />


          <SubmitButton>
            Update Password
          </SubmitButton>


        </form>


      </div>


    </main>

  );

}