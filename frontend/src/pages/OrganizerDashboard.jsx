import {
  ArrowRight,
  CalendarDays,
  MoreHorizontal,
  Plus,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"

import {
  mockAnalytics,
  mockDashboardStats,
  mockEvents,
} from "../data/mockData"

function OrganizerDashboard() {
  const iconMap = [
    CalendarDays,
    Ticket,
    Users,
    TrendingUp,
  ]

  const iconStyles = [
    {
      wrapper: "bg-indigo-100 text-indigo-600",
      accent: "text-indigo-600",
    },
    {
      wrapper: "bg-violet-100 text-violet-600",
      accent: "text-violet-600",
    },
    {
      wrapper: "bg-blue-100 text-blue-600",
      accent: "text-blue-600",
    },
    {
      wrapper: "bg-emerald-100 text-emerald-600",
      accent: "text-emerald-600",
    },
  ]

  const upcomingEvents = mockEvents.slice(0, 4)

  const maxRegistrations = Math.max(
    ...mockAnalytics.map(
      (item) => item.registrations
    )
  )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="inline-flex rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur">
                Organizer workspace
              </p>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Track your events, registrations and attendee activity
                from one place.
              </p>

            </div>

            <Link
              to="/create-event"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:from-indigo-700 hover:to-violet-700"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            KPI CARDS
        ================================================== */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {mockDashboardStats.map((stat, index) => {
            const Icon = iconMap[index]
            const style = iconStyles[index]

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/25"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.wrapper}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2">

                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-current ${style.accent}`}
                  />

                  <p className={`text-xs font-semibold ${style.accent}`}>
                    {stat.change}
                  </p>

                </div>

              </div>
            )
          })}

        </section>

        {/* =================================================
            ANALYTICS + QUICK ACTIONS
        ================================================== */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_1fr]">

          {/* Analytics */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Analytics
                </p>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                  Registration overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registration activity across recent months.
                </p>

              </div>

              <select
                defaultValue="6months"
                className="w-fit rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-xs font-semibold text-indigo-700 outline-none transition hover:border-indigo-200 focus:border-indigo-300"
              >
                <option value="6months">
                  Last 6 months
                </option>

                <option value="year">
                  This year
                </option>
              </select>

            </div>

            {/* Chart */}
            <div className="mt-8 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 sm:p-5">

              <div className="flex h-64 items-end gap-3 sm:h-72 sm:gap-6">

                {mockAnalytics.map((item) => {

                  const height =
                    (item.registrations /
                      maxRegistrations) *
                    100

                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col justify-end"
                    >

                      <div className="flex flex-1 items-end justify-center">

                        <div
                          className="w-full max-w-14 rounded-t-xl bg-gradient-to-t from-indigo-600 to-violet-500 shadow-sm transition duration-200 hover:from-indigo-500 hover:to-violet-400"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${item.registrations} registrations`}
                        />

                      </div>

                      <p className="mt-3 text-center text-xs font-medium text-slate-500">
                        {item.month}
                      </p>

                    </div>
                  )
                })}

              </div>

            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-indigo-50/60 px-4 py-3">

              <span className="text-sm text-slate-500">
                Total registrations
              </span>

              <span className="text-sm font-bold text-indigo-700">
                1,160
              </span>

            </div>

          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/50 p-6 shadow-sm sm:p-8">

            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
              Quick actions
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              Manage your events
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Jump into the tools you use most often.
            </p>

            <div className="mt-6 space-y-3">

              <Link
                to="/create-event"
                className="group flex items-center justify-between rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <div>

                  <p className="font-semibold text-slate-950">
                    Create an event
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Start planning your next experience.
                  </p>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>

              </Link>

              <Link
                to="/events"
                className="group flex items-center justify-between rounded-xl border border-violet-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50"
              >
                <div>

                  <p className="font-semibold text-slate-950">
                    Browse events
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    View the public events catalogue.
                  </p>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>

              </Link>

              <Link
                to="/profile"
                className="group flex items-center justify-between rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div>

                  <p className="font-semibold text-slate-950">
                    Manage profile
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your organizer information.
                  </p>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>

              </Link>

            </div>

          </section>

        </div>

        {/* =================================================
            UPCOMING EVENTS
        ================================================== */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">

          <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/60 px-6 py-6 sm:px-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Events
                </p>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                  Upcoming events
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor registrations and manage your events.
                </p>

              </div>

              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-800"
              >
                View public events
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

          <div className="divide-y divide-slate-100">

            {upcomingEvents.map((event) => {

              const percentage =
                (event.attendees / event.capacity) *
                100

              return (
                <div
                  key={event.id}
                  className="flex flex-col gap-5 px-6 py-5 transition hover:bg-indigo-50/20 sm:px-8 lg:flex-row lg:items-center lg:justify-between"
                >

                  {/* Event */}
                  <div className="min-w-0 lg:w-[38%]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-slate-950">
                          {event.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {event.date} · {event.time}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Registration */}
                  <div className="lg:w-[35%]">

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-slate-500">
                        Registrations
                      </span>

                      <span className="font-semibold text-slate-700">
                        {event.attendees} / {event.capacity}
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-50">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{
                          width: `${Math.min(
                            percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between gap-4 lg:w-[22%] lg:justify-end">

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      {event.status}
                    </span>

                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      aria-label={`More actions for ${event.title}`}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                  </div>

                </div>
              )
            })}

          </div>

        </section>

      </main>
    </div>
  )
}

export default OrganizerDashboard