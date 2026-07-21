export const metadata = {

  title: "Privacy Policy | Halo Marketplace",

  description:
    "Halo Marketplace privacy policy explaining how user data is collected and used."

};


export default function PrivacyPage() {

  return (

    <main className="mx-auto max-w-3xl px-6 py-16">

      <h1 className="text-3xl font-bold">
        Privacy Policy
      </h1>


      <p className="mt-4 text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>



      <p className="mt-6 leading-7 text-gray-700">

        Halo Marketplace values your privacy. We collect only the
        information required to operate our marketplace, including
        account information, email addresses, profile details, and
        listing information.

      </p>



      <p className="mt-4 leading-7 text-gray-700">

        Your information is used to provide marketplace services,
        improve user experience, maintain security, and support
        communication between buyers and sellers.

      </p>



      <p className="mt-4 leading-7 text-gray-700">

        We do not sell your personal information. Information may only
        be shared when required to provide services, comply with legal
        obligations, or protect the safety of our users.

      </p>



      <p className="mt-4 leading-7 text-gray-700">

        You may request deletion of your account and personal data at
        any time by contacting Halo Marketplace.

      </p>



      <p className="mt-4 leading-7 text-gray-700">

        This privacy policy may be updated periodically. Changes will
        be posted on this page.

      </p>


    </main>

  );

}