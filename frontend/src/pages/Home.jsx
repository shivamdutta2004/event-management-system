import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Search,
  Sparkles,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"

import CategoryCard from "../components/CategoryCard"
import EventCard from "../components/EventCard"
import Footer from "../components/Footer"
import OrganizerCTA from "../components/OrganizerCTA"

import {
  mockCategories,
  mockEvents,
} from "../data/mockData"

function Home() {
  const featuredEvents = mockEvents.slice(0, 3)

  return (
    <div className="min-h-screen overflow-hidden bg-white">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        {/* Decorative glows */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 top-12 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">

          <div className="mx-auto max-w-5xl text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Discover what's happening around you
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Find events.
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Create experiences.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Discover workshops, seminars, conferences and college events.
              Create your own events and manage registrations effortlessly.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <Link
                to="/events"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
              >
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/create-event"
                className="inline-flex w-full items-center justify-center rounded-xl border border-indigo-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 sm:w-auto"
              >
                Create an Event
              </Link>

            </div>

            {/* Trust points */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Easy registration
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Organizer tools
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Smart scheduling
              </span>

            </div>
          </div>

          {/* Search */}
          <div className="mx-auto mt-14 max-w-4xl">

            <div className="rounded-3xl border border-indigo-100 bg-white/90 p-2 shadow-xl shadow-indigo-100/50 backdrop-blur">

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-transparent bg-indigo-50/60 px-4 py-3.5 transition focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/50">

                  <Search className="h-5 w-5 shrink-0 text-indigo-500" />

                  <input
                    type="text"
                    placeholder="Search for events, workshops, conferences..."
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />

                </div>

                <Link
                  to="/events"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
                >
                  Search Events
                </Link>

              </div>

            </div>
          </div>

          {/* Small feature cards */}
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-indigo-100 bg-white/70 p-4 text-left backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-950">
                Discover upcoming events
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Find experiences that match your interests.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white/70 p-4 text-left backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Users className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-950">
                Connect with people
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Join communities and meet fellow attendees.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/70 p-4 text-left backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-950">
                Create better events
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Build schedules and manage registrations easily.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50">

        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">

          <div className="px-4 py-8 text-center sm:py-10">
            <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
              500+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Events
            </p>
          </div>

          <div className="px-4 py-8 text-center sm:py-10">
            <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
              10K+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Participants
            </p>
          </div>

          <div className="px-4 py-8 text-center sm:py-10">
            <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
              100+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Organizers
            </p>
          </div>

          <div className="px-4 py-8 text-center sm:py-10">
            <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
              50+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Categories
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          FEATURED EVENTS
      ====================================================== */}
      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Discover
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Featured events
              </h2>

              <p className="mt-3 max-w-xl text-slate-600">
                Explore popular events, workshops and experiences happening
                soon.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              View all events
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          CATEGORY SECTION
      ====================================================== */}
      <section className="border-y border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
              Explore by category
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Find something you'll love
            </h2>

            <p className="mt-3 text-slate-600">
              Browse events by interests, skills and experiences that matter
              to you.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {mockCategories.map((category) => (
              <div
                key={category.name}
                className="h-full w-full [&>*]:h-full [&>*]:w-full"
              >
                <CategoryCard category={category} />
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="bg-slate-50 py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Simple by design
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to manage events
            </h2>

            <p className="mt-3 text-slate-600">
              Discover events or create your own in just a few simple steps.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-indigo-100 bg-white p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                01
              </span>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                Discover
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Explore workshops, seminars, conferences and other events
                based on your interests.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                02
              </span>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                Register
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Reserve your place in a few clicks and keep track of every
                event you've registered for.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                03
              </span>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                Experience
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Attend the event, connect with people and make the most of
                the experience.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          ORGANIZER CTA
      ====================================================== */}
      <OrganizerCTA />

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <Footer />

    </div>
  )
}

export default Home