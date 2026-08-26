import { Link } from "react-router-dom"

function Privacy() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">

      <section className="border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Privacy
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            This page explains how Evently handles information used by the
            platform for account, event and registration functionality.
          </p>

        </div>

      </section>


      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">

        <div className="space-y-6">

          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-950">
              Information we use
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Evently may use information such as your name, email address,
              account type, event registrations and organizer information
              to provide the platform's features.
            </p>

          </section>


          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-950">
              How information is used
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Account information is used for authentication and to provide
              access to features appropriate to the selected account type.
              Registration information is used to manage event participation.
            </p>

          </section>


          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-950">
              Project notice
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              This privacy page is provided for the Evently project and is
              not intended to replace a formal legal privacy policy for a
              commercial service.
            </p>

          </section>

        </div>


        <div className="mt-8">

          <Link
            to="/"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Evently
          </Link>

        </div>

      </main>

    </div>
  )
}

export default Privacy