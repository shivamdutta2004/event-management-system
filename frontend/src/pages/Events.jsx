import {
  CalendarDays,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { useEffect, useMemo, useState } from "react"

import EventCard from "../components/EventCard"
import { apiRequest } from "../lib/api"


function Events() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDate, setSelectedDate] = useState("All")

  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  // =========================================================
  // LOAD EVENTS FROM BACKEND
  // =========================================================

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      setError("")

      try {
        const data = await apiRequest(
          "/api/events"
        )

        const backendEvents =
          Array.isArray(data)
            ? data
            : data?.events || []

        const formattedEvents =
          backendEvents.map(
            (event) =>
              normalizeEvent(event)
          )

        setEvents(formattedEvents)

      } catch (err) {
        console.error(
          "Failed to load events:",
          err
        )

        setError(
          err?.message ||
          "Unable to load events."
        )

      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])


  // =========================================================
  // DYNAMIC CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const uniqueCategories =
      events
        .map((event) => event.category)
        .filter(Boolean)

    return [
      "All",
      ...Array.from(
        new Set(uniqueCategories)
      ),
    ]
  }, [events])


  // =========================================================
  // DATE OPTIONS
  // =========================================================

  const dateOptions = [
    "All",
    "This Week",
    "Next Month",
  ]


  // =========================================================
  // FILTER EVENTS
  // =========================================================

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {

      const search =
        searchTerm
          .trim()
          .toLowerCase()


      const matchesSearch =
        search === "" ||
        event.title
          .toLowerCase()
          .includes(search) ||
        event.location
          .toLowerCase()
          .includes(search) ||
        event.organizer
          .toLowerCase()
          .includes(search)


      const matchesCategory =
        selectedCategory === "All" ||
        event.category ===
          selectedCategory


      const matchesDate =
        selectedDate === "All" ||
        event.dateGroup ===
          selectedDate


      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      )
    })
  }, [
    events,
    searchTerm,
    selectedCategory,
    selectedDate,
  ])


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedDate("All")
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">

                <CalendarDays className="h-4 w-4" />

                Discover events

              </div>


              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">

                Find your next

                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  experience.
                </span>

              </h1>


              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Browse workshops, seminars, conferences and other events
                happening around you. Discover something new and make your
                next experience memorable.
              </p>

            </div>

          </div>

        </section>


        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading events...
            </p>

          </div>

        </main>

      </div>
    )
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO / PAGE HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

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
              API ERROR
          ================================================== */}

          {error && (

            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

              <p className="text-sm font-semibold text-red-700">
                Unable to load events
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>

          )}


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
                    setSearchTerm(
                      event.target.value
                    )
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
                    setSelectedCategory(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition hover:border-indigo-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                >

                  {categories.map(
                    (category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Date */}

              <select
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
              >

                {dateOptions.map(
                  (date) => (

                    <option
                      key={date}
                      value={date}
                    >
                      {date}
                    </option>

                  )
                )}

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

              {filteredEvents.map(
                (event) => (

                  <EventCard
                    key={event.id}
                    event={event}
                  />

                )
              )}

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


// =========================================================
// EVENT NORMALIZER
// =========================================================

function normalizeEvent(event) {
  const eventDate =
    event.event_date ||
    event.date ||
    null


  const startTime =
    event.start_time ||
    ""


  const endTime =
    event.end_time ||
    ""


  const capacity =
    Number(
      event.max_attendees ??
      event.capacity ??
      0
    )


  const attendees =
    Number(
      event.attendees ??
      event.registered_count ??
      0
    )


  return {
    ...event,

    id:
      event.id,

    title:
      event.title ||
      "Untitled Event",

    description:
      event.description ||
      "",

    category:
      event.category ||
      "Technology",

    location:
      event.location ||
      "Location unavailable",

    organizer:
      event.organizer_name ||
      event.organizer ||
      "Event Organizer",

    date:
      formatEventDate(
        eventDate
      ),

    time:
      formatTimeRange(
        startTime,
        endTime
      ),

    dateGroup:
      getDateGroup(
        eventDate
      ),

    capacity,

    attendees,

    image:
      getEventGradient(
        event.id
      ),
  }
}


// =========================================================
// DATE FORMATTER
// =========================================================

function formatEventDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable"
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    )

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(dateValue)
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  )
}


// =========================================================
// TIME FORMATTER
// =========================================================

function formatTimeRange(
  startTime,
  endTime
) {
  if (!startTime) {
    return "Time unavailable"
  }

  const start =
    formatTime(startTime)

  const end =
    endTime
      ? formatTime(endTime)
      : ""

  return end
    ? `${start} – ${end}`
    : start
}


function formatTime(time) {
  if (!time) {
    return ""
  }

  const [hours, minutes] =
    String(time).split(":")

  const date = new Date()

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  )

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  )
}


// =========================================================
// DATE GROUP
// =========================================================

function getDateGroup(dateValue) {
  if (!dateValue) {
    return "All"
  }

  const eventDate =
    new Date(
      `${dateValue}T00:00:00`
    )

  if (
    Number.isNaN(
      eventDate.getTime()
    )
  ) {
    return "All"
  }


  const today = new Date()

  today.setHours(
    0,
    0,
    0,
    0
  )


  const endOfWeek =
    new Date(today)

  const day =
    today.getDay()

  const daysUntilSunday =
    7 - day

  endOfWeek.setDate(
    today.getDate() +
      daysUntilSunday
  )


  if (
    eventDate >= today &&
    eventDate <= endOfWeek
  ) {
    return "This Week"
  }


  const nextMonth =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    )

  const endOfNextMonth =
    new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    )

  if (
    eventDate >= nextMonth &&
    eventDate <= endOfNextMonth
  ) {
    return "Next Month"
  }


  return "All"
}


// =========================================================
// EVENT GRADIENT
// =========================================================

function getEventGradient(eventId) {
  const gradients = [
    "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-900",
    "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-900",
    "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900",
    "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-900",
  ]

  const index =
    Number(eventId || 1) %
    gradients.length

  return gradients[index]
}


export default Events