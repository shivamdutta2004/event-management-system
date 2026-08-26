import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Save,
  Ticket,
  TrendingUp,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Link,
  useNavigate,
} from "react-router-dom"

import {
  apiRequest,
} from "../lib/api"


function OrganizerDashboard() {
  const navigate = useNavigate()

  const iconMap = [
    CalendarDays,
    Ticket,
    Users,
    TrendingUp,
  ]


  const iconStyles = [
    {
      wrapper:
        "bg-indigo-100 text-indigo-600",
      accent: "text-indigo-600",
    },
    {
      wrapper:
        "bg-violet-100 text-violet-600",
      accent: "text-violet-600",
    },
    {
      wrapper:
        "bg-blue-100 text-blue-600",
      accent: "text-blue-600",
    },
    {
      wrapper:
        "bg-emerald-100 text-emerald-600",
      accent: "text-emerald-600",
    },
  ]


  // =========================================================
  // STATE
  // =========================================================

  const [currentUser, setCurrentUser] =
    useState(null)

  const [events, setEvents] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [successMessage, setSuccessMessage] =
    useState("")


  // =========================================================
  // EDIT EVENT STATE
  // =========================================================

  const [editingEvent, setEditingEvent] =
    useState(null)

  const [editForm, setEditForm] =
    useState({
      title: "",
      category: "",
      description: "",
      cover_image: null,
      event_date: "",
      start_time: "",
      end_time: "",
      location: "",
      max_attendees: 1,
      status: "published",
    })

  const [savingEvent, setSavingEvent] =
    useState(false)

  const [editError, setEditError] =
    useState("")


  // =========================================================
  // EVENT ACTION MENU
  // =========================================================

  const [openMenuId, setOpenMenuId] =
    useState(null)

  const [deletingEventId, setDeletingEventId] =
    useState(null)


  // =========================================================
  // REGISTRATION MANAGEMENT STATE
  // =========================================================

  const [viewingRegistrationsEvent, setViewingRegistrationsEvent] =
    useState(null)

  const [eventRegistrations, setEventRegistrations] =
    useState([])

  const [registrationsLoading, setRegistrationsLoading] =
    useState(false)

  const [registrationsError, setRegistrationsError] =
    useState("")

  const [registrationSummary, setRegistrationSummary] =
    useState({
      total: 0,
      confirmed: 0,
      cancelled: 0,
    })


  // =========================================================
  // LOAD ORGANIZER DATA
  // =========================================================

  const loadDashboard = async () => {
    setLoading(true)
    setError("")


    try {
      const [
        userData,
        eventsData,
      ] = await Promise.all([
        apiRequest(
          "/api/auth/me"
        ),

        apiRequest(
          "/api/events"
        ),
      ])


      // Organizer dashboard is restricted to organizer accounts.
      // The backend still remains responsible for enforcing API permissions.
      if (userData?.role !== "organizer") {
        navigate("/events", { replace: true })
        return
      }


      const allEvents =
        Array.isArray(eventsData)
          ? eventsData
          : eventsData?.events || []


      const organizerEvents =
        allEvents.filter(
          (event) =>
            Number(
              event.organizer_id
            ) === Number(
              userData.id
            )
        )


      setCurrentUser(
        userData
      )

      setEvents(
        organizerEvents
      )

    } catch (err) {
      console.error(
        "Failed to load organizer dashboard:",
        err
      )


      const message =
        err?.message ||
        "Unable to load organizer dashboard."


      setError(message)

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadDashboard()
  }, [])


  // =========================================================
  // DERIVED METRICS
  // =========================================================

  const totalEvents =
    events.length


  const totalRegistrations =
    events.reduce(
      (
        total,
        event
      ) =>
        total +
        Number(
          event.attendee_count || 0
        ),
      0
    )


  const totalCapacity =
    events.reduce(
      (
        total,
        event
      ) =>
        total +
        Number(
          event.max_attendees || 0
        ),
      0
    )


  const averageAttendance =
    totalEvents > 0
      ? Math.round(
          totalRegistrations /
            totalEvents
        )
      : 0


  const upcomingEvents =
    useMemo(() => {
      const today =
        new Date()

      today.setHours(
        0,
        0,
        0,
        0
      )


      return [...events]
        .filter(
          (event) => {
            if (!event.event_date) {
              return true
            }


            const eventDate =
              new Date(
                `${event.event_date}T00:00:00`
              )


            return (
              eventDate >= today
            )
          }
        )
        .sort(
          (
            a,
            b
          ) => {
            const dateA =
              new Date(
                `${a.event_date}T${
                  a.start_time ||
                  "00:00:00"
                }`
              )


            const dateB =
              new Date(
                `${b.event_date}T${
                  b.start_time ||
                  "00:00:00"
                }`
              )


            return (
              dateA - dateB
            )
          }
        )
        .slice(0, 4)
    }, [events])


  const maxRegistrations =
    Math.max(
      ...events.map(
        (event) =>
          Number(
            event.attendee_count || 0
          )
      ),
      1
    )


  const summaryStats = [
    {
      label: "Total events",
      value: totalEvents,
      change:
        totalEvents === 1
          ? "1 published event"
          : `${totalEvents} published events`,
    },

    {
      label: "Registrations",
      value:
        totalRegistrations,
      change:
        "Confirmed registrations",
    },

    {
      label: "Capacity",
      value:
        totalCapacity,
      change:
        "Total available seats",
    },

    {
      label: "Avg. attendance",
      value:
        averageAttendance,
      change:
        "Registrations per event",
    },
  ]


  // =========================================================
  // EDIT FORM HANDLERS
  // =========================================================

  const openEditModal = (
    event
  ) => {
    setOpenMenuId(null)

    setEditError("")
    setSuccessMessage("")

    setEditingEvent(event)

    setEditForm({
      title:
        event.title || "",

      category:
        event.category || "",

      description:
        event.description || "",

      cover_image:
        event.cover_image || null,

      event_date:
        event.event_date || "",

      start_time:
        String(
          event.start_time || ""
        ).slice(0, 5),

      end_time:
        String(
          event.end_time || ""
        ).slice(0, 5),

      location:
        event.location || "",

      max_attendees:
        Number(
          event.max_attendees || 1
        ),

      status:
        event.status || "published",
    })
  }


  const closeEditModal = () => {
    if (savingEvent) {
      return
    }

    setEditingEvent(null)

    setEditError("")
  }


  const handleEditChange = (
    field,
    value
  ) => {
    setEditForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )

    setEditError("")
  }


  // =========================================================
  // SAVE EVENT EDIT
  // =========================================================

  const handleSaveEvent = async (
    event
  ) => {
    setEditError("")
    setSuccessMessage("")


    if (
      !editForm.title.trim()
    ) {
      setEditError(
        "Event title is required."
      )

      return
    }


    if (
      !editForm.category.trim()
    ) {
      setEditError(
        "Event category is required."
      )

      return
    }


    if (
      !editForm.description.trim()
    ) {
      setEditError(
        "Event description is required."
      )

      return
    }


    if (
      !editForm.event_date
    ) {
      setEditError(
        "Event date is required."
      )

      return
    }


    if (
      !editForm.start_time
    ) {
      setEditError(
        "Start time is required."
      )

      return
    }


    if (
      !editForm.end_time
    ) {
      setEditError(
        "End time is required."
      )

      return
    }


    if (
      editForm.end_time <=
      editForm.start_time
    ) {
      setEditError(
        "End time must be after start time."
      )

      return
    }


    if (
      !editForm.location.trim()
    ) {
      setEditError(
        "Event location is required."
      )

      return
    }


    if (
      Number(
        editForm.max_attendees
      ) < 1
    ) {
      setEditError(
        "Maximum attendees must be at least 1."
      )

      return
    }


    setSavingEvent(true)


    try {
      const updatedEvent =
        await apiRequest(
          `/api/events/${event.id}`,
          {
            method: "PUT",

            body: {
              title:
                editForm.title.trim(),

              category:
                editForm.category.trim(),

              description:
                editForm.description.trim(),

              cover_image:
                editForm.cover_image,

              event_date:
                editForm.event_date,

              start_time:
                `${editForm.start_time}:00`,

              end_time:
                `${editForm.end_time}:00`,

              location:
                editForm.location.trim(),

              max_attendees:
                Number(
                  editForm.max_attendees
                ),

              status:
                editForm.status,
            },
          }
        )


      // -----------------------------------------------------
      // UPDATE LOCAL EVENT LIST
      // -----------------------------------------------------

      setEvents(
        (currentEvents) =>
          currentEvents.map(
            (currentEvent) =>
              Number(
                currentEvent.id
              ) ===
              Number(
                event.id
              )
                ? updatedEvent
                : currentEvent
          )
      )


      setEditingEvent(null)

      setSuccessMessage(
        "Event updated successfully."
      )

    } catch (err) {
      console.error(
        "Failed to update event:",
        err
      )


      setEditError(
        err?.message ||
        "Unable to update event."
      )

    } finally {
      setSavingEvent(false)
    }
  }


  // =========================================================
  // OPEN REGISTRATION MANAGEMENT
  // =========================================================

  const openRegistrationModal = async (event) => {
    setOpenMenuId(null)
    setViewingRegistrationsEvent(event)
    setEventRegistrations([])
    setRegistrationsError("")
    setRegistrationsLoading(true)
    setRegistrationSummary({
      total: 0,
      confirmed: 0,
      cancelled: 0,
    })

    try {
      const data = await apiRequest(
        `/api/registrations/events/${event.id}`
      )

      const registrations =
        Array.isArray(data?.registrations)
          ? data.registrations
          : []

      setEventRegistrations(registrations)

      setRegistrationSummary({
        total: Number(
          data?.total_registrations || 0
        ),
        confirmed: Number(
          data?.confirmed_registrations || 0
        ),
        cancelled: Number(
          data?.cancelled_registrations || 0
        ),
      })
    } catch (err) {
      console.error(
        "Failed to load event registrations:",
        err
      )

      setRegistrationsError(
        err?.message ||
        "Unable to load event registrations."
      )
    } finally {
      setRegistrationsLoading(false)
    }
  }


  // =========================================================
  // CLOSE REGISTRATION MODAL
  // =========================================================

  const closeRegistrationModal = () => {
    if (registrationsLoading) {
      return
    }

    setViewingRegistrationsEvent(null)
    setEventRegistrations([])
    setRegistrationsError("")
  }


  // =========================================================
  // DELETE EVENT
  // =========================================================

  const handleDeleteEvent = async (event) => {
    setOpenMenuId(null)
    setError("")
    setSuccessMessage("")

    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setDeletingEventId(event.id)

    try {
      await apiRequest(
        `/api/events/${event.id}`,
        {
          method: "DELETE",
        }
      )

      setEvents((currentEvents) =>
        currentEvents.filter(
          (currentEvent) =>
            Number(currentEvent.id) !== Number(event.id)
        )
      )

      setSuccessMessage(
        "Event deleted successfully."
      )
    } catch (err) {
      console.error(
        "Failed to delete event:",
        err
      )

      setError(
        err?.message ||
        "Unable to delete event."
      )
    } finally {
      setDeletingEventId(null)
    }
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-200/25 blur-3xl" />


          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            <p className="inline-flex rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur">
              Organizer workspace
            </p>


            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Dashboard
            </h1>


            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Loading your organizer data...
            </p>

          </div>

        </section>


        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading dashboard...
            </p>

          </div>

        </main>

      </div>
    )
  }


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
                {currentUser?.full_name
                  ? `Welcome back, ${currentUser.full_name}.`
                  : "Track your events, registrations and attendee activity from one place."}
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
            ERROR
        ================================================== */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

            <p className="text-sm font-semibold text-red-700">
              Unable to load dashboard
            </p>


            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================== */}

        {successMessage && (

          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">

            <div className="flex items-center gap-2">

              <CheckCircle2 className="h-5 w-5 text-emerald-600" />


              <p className="text-sm font-semibold text-emerald-700">
                {successMessage}
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            KPI CARDS
        ================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {summaryStats.map(
            (
              stat,
              index
            ) => {

              const Icon =
                iconMap[index]

              const style =
                iconStyles[index]


              return (

                <div
                  key={
                    stat.label
                  }
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

                    <p
                      className={`text-xs font-semibold ${style.accent}`}
                    >
                      {stat.change}
                    </p>

                  </div>

                </div>

              )
            }
          )}

        </section>


        {/* =================================================
            ANALYTICS + QUICK ACTIONS
        ================================================== */}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_1fr]">


          {/* =================================================
              REGISTRATION OVERVIEW
          ================================================== */}

          <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Analytics
              </p>


              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                Registration overview
              </h2>


              <p className="mt-1 text-sm text-slate-500">
                Confirmed registrations across your upcoming events.
              </p>

            </div>


            {events.length > 0 ? (

              <div className="mt-8 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 sm:p-5">

                <div className="flex h-64 items-end gap-3 sm:h-72 sm:gap-6">

                  {events
                    .slice(0, 8)
                    .map(
                      (
                        event
                      ) => {

                        const registrations =
                          Number(
                            event.attendee_count ||
                              0
                          )


                        const height =
                          (
                            registrations /
                            maxRegistrations
                          ) *
                          100


                        return (

                          <div
                            key={
                              event.id
                            }
                            className="flex h-full flex-1 flex-col justify-end"
                          >

                            <div className="flex flex-1 items-end justify-center">

                              <div
                                className="w-full max-w-14 rounded-t-xl bg-gradient-to-t from-indigo-600 to-violet-500 shadow-sm transition duration-200 hover:from-indigo-500 hover:to-violet-400"
                                style={{
                                  height:
                                    `${Math.max(
                                      height,
                                      registrations >
                                        0
                                        ? 4
                                        : 1
                                    )}%`,
                                }}
                                title={`${registrations} registrations`}
                              />

                            </div>


                            <p className="mt-3 truncate text-center text-xs font-medium text-slate-500">
                              {event.title}
                            </p>

                          </div>

                        )
                      }
                    )}

                </div>

              </div>

            ) : (

              <div className="mt-8 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 px-6 py-20 text-center">

                <CalendarDays className="mx-auto h-8 w-8 text-indigo-400" />


                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No events yet
                </p>


                <p className="mt-1 text-sm text-slate-500">
                  Create your first event to start tracking registrations.
                </p>

              </div>

            )}


            <div className="mt-5 flex items-center justify-between rounded-xl bg-indigo-50/60 px-4 py-3">

              <span className="text-sm text-slate-500">
                Total registrations
              </span>


              <span className="text-sm font-bold text-indigo-700">
                {totalRegistrations}
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

        <section className="mt-8 overflow-visible rounded-2xl border border-indigo-100 bg-white shadow-sm">

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

            {upcomingEvents.length > 0 ? (

              upcomingEvents.map(
                (event) => {

                  const attendees =
                    Number(
                      event.attendee_count ||
                        0
                    )


                  const capacity =
                    Number(
                      event.max_attendees ||
                        0
                    )


                  const percentage =
                    capacity > 0
                      ? (
                          attendees /
                          capacity
                        ) *
                        100
                      : 0


                  return (

                    <div
                      key={event.id}
                      className="relative flex flex-col gap-5 px-6 py-5 transition hover:bg-indigo-50/20 sm:px-8 lg:flex-row lg:items-center lg:justify-between"
                    >


                      {/* =======================================
                          EVENT
                      ======================================== */}

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

                              {formatEventDate(
                                event.event_date
                              )}

                              {" · "}

                              {formatTime(
                                event.start_time
                              )}

                              {" – "}

                              {formatTime(
                                event.end_time
                              )}

                            </p>

                          </div>

                        </div>

                      </div>


                      {/* =======================================
                          REGISTRATION
                      ======================================== */}

                      <div className="lg:w-[35%]">

                        <div className="flex items-center justify-between text-sm">

                          <span className="text-slate-500">
                            Registrations
                          </span>


                          <span className="font-semibold text-slate-700">
                            {attendees} / {capacity}
                          </span>

                        </div>


                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-50">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            style={{
                              width:
                                `${Math.min(
                                  percentage,
                                  100
                                )}%`,
                            }}
                          />

                        </div>

                      </div>


                      {/* =======================================
                          STATUS + ACTIONS
                      ======================================== */}

                      <div className="flex items-center justify-between gap-4 lg:w-[22%] lg:justify-end">

                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700">
                          {event.status}
                        </span>


                        {/* =====================================
                            ACTION MENU
                        ====================================== */}

                        <div className="relative">

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(
                                (currentId) =>
                                  currentId ===
                                  event.id
                                    ? null
                                    : event.id
                              )
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            aria-label={`Manage ${event.title}`}
                          >

                            <MoreHorizontal className="h-5 w-5" />

                          </button>


                          {openMenuId ===
                            event.id && (

                            <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    event
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                              >

                                <Save className="h-4 w-4" />

                                Edit Event

                              </button>


                              <Link
                                to={`/events/${event.id}`}
                                onClick={() =>
                                  setOpenMenuId(
                                    null
                                  )
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                              >

                                <ArrowRight className="h-4 w-4" />

                                View Event

                              </Link>


                              <button
                                type="button"
                                onClick={() =>
                                  openRegistrationModal(
                                    event
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                              >

                                <UserRound className="h-4 w-4" />

                                Registrations

                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteEvent(
                                    event
                                  )
                                }
                                disabled={
                                  deletingEventId ===
                                  event.id
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                {deletingEventId ===
                                event.id ? (

                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

                                ) : (

                                  <Trash2 className="h-4 w-4" />

                                )}

                                {deletingEventId ===
                                event.id
                                  ? "Deleting..."
                                  : "Delete Event"}

                              </button>

                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                  )
                }
              )

            ) : (

              <div className="px-6 py-16 text-center sm:px-8">

                <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />


                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No upcoming events
                </p>


                <p className="mt-1 text-sm text-slate-500">
                  Create an event to start building your organizer workspace.
                </p>


                <Link
                  to="/create-event"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >

                  <Plus className="h-4 w-4" />

                  Create Event

                </Link>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* =====================================================
          EVENT REGISTRATIONS MODAL
      ====================================================== */}

      {viewingRegistrationsEvent && (

        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="flex h-[88vh] max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-5">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Attendee management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {viewingRegistrationsEvent.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View attendees and registration details for this event.
                </p>
              </div>

              <button
                type="button"
                onClick={closeRegistrationModal}
                disabled={registrationsLoading}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close registrations"
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            <div className="grid shrink-0 gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-medium text-slate-400">
                  Total registrations
                </p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  {registrationSummary.total}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-medium text-emerald-600">
                  Confirmed
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {registrationSummary.confirmed}
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-medium text-red-600">
                  Cancelled
                </p>
                <p className="mt-1 text-xl font-bold text-red-700">
                  {registrationSummary.cancelled}
                </p>
              </div>

            </div>


            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">

              {registrationsLoading ? (

                <div className="flex h-full min-h-64 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <p className="mt-4 text-sm font-medium text-slate-600">
                      Loading registrations...
                    </p>
                  </div>
                </div>

              ) : registrationsError ? (

                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6">
                  <p className="text-sm font-semibold text-red-700">
                    Unable to load registrations
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    {registrationsError}
                  </p>
                </div>

              ) : eventRegistrations.length === 0 ? (

                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 px-6 py-12 text-center">
                  <div>
                    <UserRound className="mx-auto h-9 w-9 text-indigo-300" />
                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      No registrations yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Attendees will appear here when they register for this event.
                    </p>
                  </div>
                </div>

              ) : (

                <div className="overflow-x-auto rounded-2xl border border-slate-200">

                  <table className="min-w-full divide-y divide-slate-200">

                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Attendee
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Registration #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Registered at
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">

                      {eventRegistrations.map(
                        (registration) => (

                          <tr
                            key={registration.id}
                            className="hover:bg-indigo-50/30"
                          >

                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-slate-950">
                                {registration.attendee_name ||
                                  "Unknown attendee"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {registration.attendee_email ||
                                  "No email"}
                              </p>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {registration.attendee_phone || "—"}
                            </td>

                            <td className="px-4 py-4">
                              <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
                                {registration.registration_number || "—"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold capitalize ${
                                  registration.status ===
                                  "confirmed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {registration.status || "unknown"}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {formatDateTime(
                                registration.registered_at
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>


            <div className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={closeRegistrationModal}
                disabled={registrationsLoading}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          EDIT EVENT MODAL
      ====================================================== */}

      {editingEvent && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          {/* =================================================
              FIXED MODAL STRUCTURE
              Header + Scrollable Body + Always-visible Footer
          ================================================== */}

          <div className="flex h-[90vh] max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">


            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Organizer
                </p>


                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Edit Event
                </h2>


                <p className="mt-1 text-sm text-slate-500">
                  Update your event information.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={
                  savingEvent
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close edit event"
              >

                <X className="h-5 w-5" />

              </button>

            </div>


            {/* =================================================
                MODAL BODY
            ================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">

              {editError && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                  <p className="text-sm font-semibold text-red-700">
                    Unable to update event
                  </p>


                  <p className="mt-1 text-sm text-red-600">
                    {editError}
                  </p>

                </div>

              )}


              <div className="grid gap-5 md:grid-cols-2">


                {/* TITLE */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="edit-title"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Event title
                  </label>


                  <input
                    id="edit-title"
                    type="text"
                    value={
                      editForm.title
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "title",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* CATEGORY */}

                <div>

                  <label
                    htmlFor="edit-category"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>


                  <input
                    id="edit-category"
                    type="text"
                    value={
                      editForm.category
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "category",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* STATUS */}

                <div>

                  <label
                    htmlFor="edit-status"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Status
                  </label>


                  <select
                    id="edit-status"
                    value={
                      editForm.status
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "status",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  >

                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>


                {/* DATE */}

                <div>

                  <label
                    htmlFor="edit-date"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Event date
                  </label>


                  <input
                    id="edit-date"
                    type="date"
                    value={
                      editForm.event_date
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "event_date",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* MAX ATTENDEES */}

                <div>

                  <label
                    htmlFor="edit-capacity"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Maximum attendees
                  </label>


                  <input
                    id="edit-capacity"
                    type="number"
                    min="1"
                    value={
                      editForm.max_attendees
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "max_attendees",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* START TIME */}

                <div>

                  <label
                    htmlFor="edit-start-time"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Start time
                  </label>


                  <input
                    id="edit-start-time"
                    type="time"
                    value={
                      editForm.start_time
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "start_time",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* END TIME */}

                <div>

                  <label
                    htmlFor="edit-end-time"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    End time
                  </label>


                  <input
                    id="edit-end-time"
                    type="time"
                    value={
                      editForm.end_time
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "end_time",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* LOCATION */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="edit-location"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Location
                  </label>


                  <input
                    id="edit-location"
                    type="text"
                    value={
                      editForm.location
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "location",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="edit-description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>


                  <textarea
                    id="edit-description"
                    rows="6"
                    value={
                      editForm.description
                    }
                    onChange={(event) =>
                      handleEditChange(
                        "description",
                        event.target.value
                      )
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                ALWAYS-VISIBLE MODAL FOOTER
            ================================================== */}

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={
                  savingEvent
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={() =>
                  handleSaveEvent(
                    editingEvent
                  )
                }
                disabled={
                  savingEvent
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/30 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {savingEvent ? (

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                ) : (

                  <Save className="h-4 w-4" />

                )}


                {savingEvent
                  ? "Saving..."
                  : "Save changes"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


// =========================================================
// DATE FORMATTER
// =========================================================

function formatEventDate(
  dateValue
) {
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
    return String(
      dateValue
    )
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

function formatTime(
  timeValue
) {
  if (!timeValue) {
    return "Time unavailable"
  }


  const [
    hours,
    minutes,
  ] = String(
    timeValue
  )
    .split(":")
    .map(Number)


  const date =
    new Date()


  date.setHours(
    hours,
    minutes,
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


function formatDateTime(
  value
) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  )
}


export default OrganizerDashboard