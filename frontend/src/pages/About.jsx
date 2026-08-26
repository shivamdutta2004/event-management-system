import { Link } from "react-router-dom"

function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">

      <section className="border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            About Evently
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Events made simple.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Evently is an event discovery and management platform built to
            make it easier for people to discover events, register for
            experiences and manage events from one place.
          </p>

        </div>

      </section>


      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-950">
            What Evently offers
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">

            <p>
              Attendees can explore upcoming events, view event details,
              register for events and manage their registrations.
            </p>

            <p>
              Organizers can create and publish events, manage schedules,
              update event information and monitor registrations.
            </p>

            <p>
              Evently was developed as a full-stack event management project
              with separate attendee and organizer workflows.
            </p>

          </div>

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

export default About