import { Link } from "react-router-dom"

function Terms() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">

      <section className="border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Terms
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Guidelines for using Evently as an attendee or organizer.
          </p>

        </div>

      </section>


      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">

        <div className="space-y-6">

          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-950">
              Account responsibility
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Users are responsible for providing accurate account
              information and keeping their login credentials secure.
            </p>

          </section>


          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-950">
              Organizer responsibility
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Organizers are responsible for the accuracy of event details,
              schedules, capacity information and other content they publish.
            </p>

          </section>


          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-950">
              Project notice
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              These terms are provided for the Evently project and are not
              intended to constitute a formal commercial legal agreement.
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

export default Terms