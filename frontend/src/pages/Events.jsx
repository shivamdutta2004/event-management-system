import {
  CalendarDays,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { useMemo, useState } from "react"
import EventCard from "../components/EventCard"
import { mockEvents } from "../data/mockData"

function Events() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDate, setSelectedDate] = useState("All")

  const categories = [
    "All",
    "Technology",
    "Career",
    "Education",
    "Creative",
  ]

  const dateOptions = [
    "All",
    "This Week",
    "Next Month",
  ]

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const search = searchTerm.trim().toLowerCase()

      const matchesSearch =
        search === "" ||
        event.title.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search) ||
        event.organizer.toLowerCase().includes(search)

      const matchesCategory =
        selectedCategory === "All" ||
        event.category === selectedCategory

      const matchesDate =
        selectedDate === "All" ||
        event.dateGroup === selectedDate

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      )
    })
  }, [searchTerm, selectedCategory, selectedDate])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedDate("All")
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO / PAGE HEADER
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
              <CalendarDays className="h-4 w-4" />
              Discover events
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find your next
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                experience.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse workshops, seminars, conferences and other events
              happening around you. Discover something new and make your
              next experience memorable.
            </p>

            {/* Category chips */}
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-indigo-100 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                Workshops
              </span>

              <span className="rounded-full bg-violet-100 px-3.5 py-1.5 text-xs font-semibold text-violet-700">
                Conferences
              </span>

              <span className="rounded-full bg-blue-100 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                College Events
              </span>

              <span className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                Career
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <section className="bg-slate-50 py-10 sm:py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* =================================================
              SEARCH + FILTERS
          ================================================== */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-lg shadow-indigo-100/40">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

              {/* Search */}
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/60">

                <Search className="h-5 w-5 shrink-0 text-indigo-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search by event, location or organizer..."
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

              </div>

              {/* Category */}
              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition hover:border-indigo-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

              </div>

              {/* Date */}
              <select
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
                className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
              >
                {dateOptions.map((date) => (
                  <option
                    key={date}
                    value={date}
                  >
                    {date}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* =================================================
              RESULTS HEADER
          ================================================== */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-2">

                <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {filteredEvents.length}
                </span>

                <p className="text-sm font-medium text-slate-500">
                  {filteredEvents.length === 1
                    ? "event found"
                    : "events found"}
                </p>

              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Upcoming events
              </h2>

            </div>

            <p className="text-sm text-slate-500">
              Showing the latest events
            </p>

          </div>

          {/* =================================================
              EVENT GRID
          ================================================== */}
          {filteredEvents.length > 0 ? (

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}

            </div>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================== */
            <div className="mt-8 rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600">
                <Search className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                No events found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your search term or selecting a different
                category or date.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Clear filters
              </button>

            </div>

          )}

        </div>
      </section>

    </div>
  )
}

export default Events