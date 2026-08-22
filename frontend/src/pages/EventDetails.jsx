import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { mockEvents } from "../data/mockData"

function EventDetails() {
  const { id } = useParams()

  const event =
    mockEvents.find(
      (item) => item.id === Number(id)
    ) || mockEvents[0]

  const seatsLeft = Math.max(
    event.capacity - event.attendees,
    0
  )

  const registrationPercentage = Math.min(
    (event.attendees / event.capacity) * 100,
    100
  )

  const schedule = [
    {
      time: "10:00 AM",
      title: "Welcome & Introduction",
      description:
        "Opening session, event overview and introduction to the speakers.",
    },
    {
      time: "11:00 AM",
      title: "Introduction to Artificial Intelligence",
      description:
        "Understand the fundamentals of AI and its applications across industries.",
    },
    {
      time: "12:30 PM",
      title: "Lunch & Networking",
      description:
        "Take a break, connect with other participants and exchange ideas.",
    },
    {
      time: "02:00 PM",
      title: "Machine Learning Fundamentals",
      description:
        "Explore model training, supervised learning and practical examples.",
    },
    {
      time: "03:30 PM",
      title: "Hands-on Session & Q&A",
      description:
        "Work through a practical example followed by an interactive Q&A.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP AREA
      ====================================================== */}
      <section className="border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>

        </div>
      </section>

      {/* =====================================================
          EVENT HERO
      ====================================================== */}
      <section className="bg-slate-50 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${event.image} shadow-xl`}
          >

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">

              <div className="max-w-4xl">

                {/* Category */}
                <span className="inline-flex rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                  {event.category}
                </span>

                {/* Title */}
                <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
                  {event.title}
                </h1>

                {/* Description */}
                <p className="mt-5 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
                  {event.description}
                </p>

                {/* Quick stats */}
                <div className="mt-8 flex flex-wrap gap-3">

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur">
                    <CalendarDays className="h-4 w-4" />
                    {event.date}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur">
                    <Clock3 className="h-4 w-4" />
                    {event.time}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur">
                    <Users className="h-4 w-4" />
                    {event.attendees} registered
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}
          <div className="space-y-8">

            {/* About */}
            <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                About this event
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Learn, connect and build something meaningful.
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                <p>
                  {event.description}
                </p>

                <p>
                  Whether you are beginning your journey in technology,
                  looking to strengthen your existing knowledge, or simply
                  interested in meeting like-minded people, this event is
                  designed to provide practical exposure and meaningful
                  conversations.
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <p className="text-sm font-semibold text-indigo-700">
                    Practical
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Learn through examples and hands-on activities.
                  </p>
                </div>

                <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
                  <p className="text-sm font-semibold text-violet-700">
                    Networking
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Meet participants and exchange ideas.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Experience
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Gain insights from speakers and sessions.
                  </p>
                </div>

              </div>

            </section>

            {/* Schedule */}
            <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                  Agenda
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Event schedule
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Explore the sessions and activities planned for the event.
                </p>
              </div>

              <div className="mt-8 space-y-0">

                {schedule.map((session, index) => (
                  <div
                    key={`${session.time}-${session.title}`}
                    className="relative grid gap-4 sm:grid-cols-[100px_1fr]"
                  >

                    {/* Timeline */}
                    <div className="relative sm:text-right">

                      <p className="text-sm font-semibold text-slate-700">
                        {session.time}
                      </p>

                      {index !== schedule.length - 1 && (
                        <div className="absolute left-[50px] top-8 hidden h-[calc(100%+16px)] w-px bg-violet-100 sm:block" />
                      )}

                    </div>

                    {/* Session */}
                    <div className="relative pb-8">

                      <div className="absolute -left-[8px] top-1 hidden h-3 w-3 rounded-full border-2 border-white bg-violet-600 shadow-sm sm:block" />

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:ml-3">

                        <h3 className="font-semibold text-slate-950">
                          {session.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {session.description}
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </section>

            {/* Location */}
            <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Location
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Where it happens
              </h2>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 sm:flex-row sm:items-center">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-950">
                    {event.location}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Join us at the event venue and be part of the experience.
                  </p>
                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}
          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-lg shadow-indigo-100/30">

              {/* Registration header */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">

                <p className="text-sm font-medium text-white/75">
                  Registration
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {event.attendees}
                </p>

                <p className="mt-1 text-sm text-white/75">
                  people registered
                </p>

              </div>

              <div className="p-6">

                {/* Seats */}
                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p className="text-sm text-slate-500">
                      Availability
                    </p>

                    <p className="mt-1 font-semibold text-slate-950">
                      {seatsLeft > 0
                        ? `${seatsLeft} seats left`
                        : "Event is full"}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-600">
                    {event.attendees}/{event.capacity}
                  </span>

                </div>

                {/* Progress */}
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-50">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{
                      width: `${registrationPercentage}%`,
                    }}
                  />

                </div>

                {/* Register */}
                <button
                  type="button"
                  disabled={seatsLeft === 0}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {seatsLeft > 0
                    ? "Register Now"
                    : "Event Full"}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  Registration is currently open. You can manage your
                  registration later from My Registrations.
                </p>

                <div className="my-6 border-t border-slate-100" />

                {/* Details */}
                <div className="space-y-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {event.date}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Time
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {event.time}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                        {event.location}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Organized by
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {event.organizer}
                  </p>
                </div>

              </div>

            </div>

          </aside>

        </div>
      </main>
    </div>
  )
}

export default EventDetails