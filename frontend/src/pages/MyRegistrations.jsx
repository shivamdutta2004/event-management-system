import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MoreHorizontal,
  Ticket,
  XCircle,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import {
  mockEvents,
  mockRegistrations,
} from "../data/mockData"

function MyRegistrations() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [registrations, setRegistrations] = useState(
    mockRegistrations
  )

  const registrationDetails = useMemo(() => {
    return registrations.map((registration) => {
      const event =
        mockEvents.find(
          (item) => item.id === registration.eventId
        ) || {}

      return {
        ...event,
        ...registration,
      }
    })
  }, [registrations])

  const filteredRegistrations = useMemo(() => {
    return registrationDetails.filter(
      (registration) => registration.type === activeTab
    )
  }, [registrationDetails, activeTab])

  const upcomingCount = registrations.filter(
    (registration) => registration.type === "upcoming"
  ).length

  const pastCount = registrations.filter(
    (registration) => registration.type === "past"
  ).length

  const cancelRegistration = (registrationId) => {
    setRegistrations((current) =>
      current.map((registration) =>
        registration.id === registrationId
          ? {
              ...registration,
              status: "Cancelled",
            }
          : registration
      )
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <Ticket className="h-5 w-5" />
            </div>

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Your account
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                My registrations
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Keep track of the events you've registered for and manage
                your upcoming experiences.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            SUMMARY CARDS
        ================================================== */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Upcoming */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-indigo-700">
                  Upcoming
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {upcomingCount}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  events you're attending
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Completed
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {pastCount}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  past registrations
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* Total */}
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-violet-700">
                  Total
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {registrations.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  registrations
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Ticket className="h-5 w-5" />
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            TABS
        ================================================== */}
        <section className="mt-8">

          <div className="flex flex-col gap-4 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-6">

              {/* Upcoming */}
              <button
                type="button"
                onClick={() => setActiveTab("upcoming")}
                className={`relative pb-4 text-sm font-semibold transition ${
                  activeTab === "upcoming"
                    ? "text-indigo-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Upcoming

                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === "upcoming"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {upcomingCount}
                </span>

                {activeTab === "upcoming" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" />
                )}
              </button>

              {/* Past */}
              <button
                type="button"
                onClick={() => setActiveTab("past")}
                className={`relative pb-4 text-sm font-semibold transition ${
                  activeTab === "past"
                    ? "text-violet-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Past

                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === "past"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {pastCount}
                </span>

                {activeTab === "past" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600" />
                )}
              </button>

            </div>

            <Link
              to="/events"
              className="mb-3 inline-flex w-fit items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              Discover more events
            </Link>

          </div>

          {/* =================================================
              REGISTRATION LIST
          ================================================== */}
          {filteredRegistrations.length > 0 ? (

            <div className="mt-6 space-y-5">

              {filteredRegistrations.map((registration) => {

                const isCancelled =
                  registration.status === "Cancelled"

                const isCompleted =
                  registration.status === "Completed"

                return (
                  <article
                    key={registration.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/30"
                  >

                    <div className="flex flex-col lg:flex-row">

                      {/* Event visual */}
                      <div
                        className={`relative h-52 shrink-0 overflow-hidden ${
                          registration.image
                        } lg:h-auto lg:w-64`}
                      >

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                          {registration.category}
                        </span>

                        <span className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                          {registration.date}
                        </span>

                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">

                        <div>

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                                {registration.title}
                              </h2>

                              <p className="mt-1 text-sm text-slate-500">
                                Organized by {registration.organizer}
                              </p>

                            </div>

                            {/* Status */}
                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                isCancelled
                                  ? "bg-rose-50 text-rose-700"
                                  : isCompleted
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-emerald-50 text-emerald-700"
                              }`}
                            >

                              {isCancelled ? (
                                <XCircle className="h-3.5 w-3.5" />
                              ) : isCompleted ? (
                                <Clock3 className="h-3.5 w-3.5" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}

                              {registration.status}

                            </span>

                          </div>

                          {/* Metadata */}
                          <div className="mt-6 grid gap-3 sm:grid-cols-2">

                            <div className="flex items-center gap-2.5 text-sm text-slate-500">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <CalendarDays className="h-4 w-4" />
                              </div>
                              <span>{registration.date}</span>
                            </div>

                            <div className="flex items-center gap-2.5 text-sm text-slate-500">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                <Clock3 className="h-4 w-4" />
                              </div>
                              <span>{registration.time}</span>
                            </div>

                            <div className="flex items-center gap-2.5 text-sm text-slate-500 sm:col-span-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <MapPin className="h-4 w-4" />
                              </div>

                              <span>
                                {registration.location}
                              </span>
                            </div>

                          </div>

                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                          <p className="text-xs text-slate-400">
                            Registration #
                            {String(registration.id).padStart(5, "0")}
                          </p>

                          <div className="flex flex-wrap gap-2">

                            <Link
                              to={`/events/${registration.eventId}`}
                              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                              View Event
                            </Link>

                            {registration.type === "upcoming" &&
                              !isCancelled &&
                              !isCompleted && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    cancelRegistration(
                                      registration.id
                                    )
                                  }
                                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                >
                                  Cancel Registration
                                </button>
                              )}

                            <button
                              type="button"
                              className="rounded-xl border border-slate-200 p-2.5 text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              aria-label={`More actions for ${registration.title}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>

                          </div>

                        </div>

                      </div>
                    </div>
                  </article>
                )
              })}

            </div>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================== */
            <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600">
                <Ticket className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                No registrations here yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Explore upcoming events and register for an experience that
                interests you.
              </p>

              <Link
                to="/events"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
              >
                Explore Events
                <span aria-hidden="true">→</span>
              </Link>

            </div>

          )}

        </section>

      </main>
    </div>
  )
}

export default MyRegistrations