import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Pencil,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react"

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  useEffect,
  useState,
} from "react"

import {
  apiRequest,
} from "../lib/api"


function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()


  // =========================================================
  // STATE
  // =========================================================

  const [event, setEvent] =
    useState(null)

  const [schedule, setSchedule] =
    useState([])

  const [attendeeCount, setAttendeeCount] =
    useState(0)

  const [currentUser, setCurrentUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [scheduleLoading, setScheduleLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [scheduleError, setScheduleError] =
    useState("")

  const [registering, setRegistering] =
    useState(false)

  const [registrationSuccess, setRegistrationSuccess] =
    useState(false)

  const [registrationError, setRegistrationError] =
    useState("")

  const [alreadyRegistered, setAlreadyRegistered] =
    useState(false)


  // =========================================================
  // SCHEDULE EDIT STATE
  // =========================================================

  const [editingSchedule, setEditingSchedule] =
    useState(null)

  const [scheduleForm, setScheduleForm] =
    useState({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      session_order: 1,
    })

  const [savingSchedule, setSavingSchedule] =
    useState(false)

  const [scheduleEditError, setScheduleEditError] =
    useState("")

  const [scheduleEditSuccess, setScheduleEditSuccess] =
    useState("")


  // =========================================================
  // DELETE STATE
  // =========================================================

  const [deletingScheduleId, setDeletingScheduleId] =
    useState(null)

  const [scheduleDeleteError, setScheduleDeleteError] =
    useState("")


  // =========================================================
  // LOAD EVENT
  // =========================================================

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true)
      setError("")


      try {
        const data =
          await apiRequest(
            `/api/events/${id}`
          )


        const normalizedEvent =
          normalizeEvent(data)


        setEvent(
          normalizedEvent
        )


        setAttendeeCount(
          Number(
            data.attendee_count ?? 0
          )
        )

      } catch (err) {
        console.error(
          "Failed to load event:",
          err
        )


        setError(
          err?.message ||
          "Unable to load this event."
        )

      } finally {
        setLoading(false)
      }
    }


    loadEvent()
  }, [id])


  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data =
          await apiRequest(
            "/api/auth/me"
          )

        setCurrentUser(data)

      } catch (err) {
        // Public visitors may not be authenticated.
        setCurrentUser(null)
      }
    }


    loadCurrentUser()
  }, [])


  // =========================================================
  // LOAD REAL EVENT SCHEDULE
  // =========================================================

  const loadSchedule = async () => {
    setScheduleLoading(true)
    setScheduleError("")


    try {
      const data =
        await apiRequest(
          `/api/events/${id}/schedules`
        )


      const schedules =
        Array.isArray(data)
          ? data
          : data?.schedules || []


      setSchedule(
        schedules
          .sort(
            (a, b) =>
              Number(
                a.session_order || 0
              ) -
              Number(
                b.session_order || 0
              )
          )
          .map(
            (session) => ({
              ...session,

              time:
                formatTimeRange(
                  session.start_time,
                  session.end_time
                ),
            })
          )
      )

    } catch (err) {
      console.error(
        "Failed to load schedule:",
        err
      )


      setScheduleError(
        err?.message ||
        "Unable to load the event schedule."
      )


      setSchedule([])

    } finally {
      setScheduleLoading(false)
    }
  }


  useEffect(() => {
    loadSchedule()
  }, [id])


  // =========================================================
  // CHECK CURRENT USER REGISTRATION
  // =========================================================

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const data =
          await apiRequest(
            "/api/registrations/me"
          )


        const registrations =
          Array.isArray(data)
            ? data
            : data?.registrations || []


        const currentRegistration =
          registrations.find(
            (registration) =>
              Number(
                registration.event_id
              ) === Number(id) &&
              String(
                registration.status || ""
              ).toLowerCase() ===
                "confirmed"
          )


        if (currentRegistration) {
          setAlreadyRegistered(true)
          setRegistrationSuccess(true)
        } else {
          setAlreadyRegistered(false)
          setRegistrationSuccess(false)
        }

      } catch (err) {
        console.log(
          "Registration check skipped:",
          err
        )

        setAlreadyRegistered(false)
      }
    }


    checkRegistration()
  }, [id])


  // =========================================================
  // CHECK ORGANIZER ACCESS
  // =========================================================

  const isOrganizer =
    Boolean(
      currentUser &&
      event &&
      currentUser.role === "organizer" &&
      Number(currentUser.id) ===
        Number(event.organizer_id)
    )


  // =========================================================
  // REGISTER FOR EVENT
  // =========================================================

  const handleRegister = async () => {
    if (alreadyRegistered) {
      return
    }


    setRegistrationError("")
    setRegistrationSuccess(false)
    setRegistering(true)


    try {
      const data =
        await apiRequest(
          `/api/registrations/events/${id}`,
          {
            method: "POST",
          }
        )


      console.log(
        "Registration successful:",
        data
      )


      setRegistrationSuccess(true)
      setAlreadyRegistered(true)


      setAttendeeCount(
        (current) =>
          current + 1
      )

    } catch (err) {
      console.error(
        "Registration failed:",
        err
      )


      const message =
        err?.message ||
        "Unable to register for this event."


      const lowerMessage =
        message.toLowerCase()


      // -----------------------------------------------------
      // AUTHENTICATION ERROR
      // -----------------------------------------------------

      if (
        lowerMessage.includes(
          "invalid or expired token"
        ) ||
        lowerMessage.includes(
          "not authenticated"
        ) ||
        lowerMessage.includes(
          "unauthorized"
        ) ||
        message.includes("401")
      ) {
        navigate("/login")
        return
      }


      // -----------------------------------------------------
      // DUPLICATE REGISTRATION
      // -----------------------------------------------------

      if (
        lowerMessage.includes(
          "already registered"
        )
      ) {
        setAlreadyRegistered(true)
        setRegistrationSuccess(true)
        return
      }


      setRegistrationError(
        message
      )

    } finally {
      setRegistering(false)
    }
  }


  // =========================================================
  // OPEN EDIT SCHEDULE MODAL
  // =========================================================

  const openScheduleEditor = (
    session
  ) => {
    setScheduleEditError("")
    setScheduleEditSuccess("")

    setEditingSchedule(
      session
    )

    setScheduleForm({
      title:
        session.title || "",

      description:
        session.description || "",

      start_time:
        String(
          session.start_time || ""
        ).slice(0, 5),

      end_time:
        String(
          session.end_time || ""
        ).slice(0, 5),

      session_order:
        Number(
          session.session_order || 1
        ),
    })
  }


  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeScheduleEditor = () => {
    if (savingSchedule) {
      return
    }

    setEditingSchedule(null)

    setScheduleEditError("")
  }


  // =========================================================
  // UPDATE SCHEDULE FORM
  // =========================================================

  const handleScheduleFormChange = (
    field,
    value
  ) => {
    setScheduleForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )

    setScheduleEditError("")
  }


  // =========================================================
  // SAVE SCHEDULE EDIT
  // =========================================================

  const handleSaveSchedule = async () => {
    if (!editingSchedule) {
      return
    }


    setScheduleEditError("")
    setScheduleEditSuccess("")


    if (
      !scheduleForm.title.trim()
    ) {
      setScheduleEditError(
        "Session title is required."
      )

      return
    }


    if (
      !scheduleForm.start_time
    ) {
      setScheduleEditError(
        "Session start time is required."
      )

      return
    }


    if (
      !scheduleForm.end_time
    ) {
      setScheduleEditError(
        "Session end time is required."
      )

      return
    }


    if (
      scheduleForm.end_time <=
      scheduleForm.start_time
    ) {
      setScheduleEditError(
        "Session end time must be after start time."
      )

      return
    }


    setSavingSchedule(true)


    try {
      await apiRequest(
        `/api/events/${id}/schedules/${editingSchedule.id}`,
        {
          method: "PUT",

          body: {
            session_order:
              Number(
                scheduleForm.session_order
              ),

            title:
              scheduleForm.title.trim(),

            start_time:
              `${scheduleForm.start_time}:00`,

            end_time:
              `${scheduleForm.end_time}:00`,

            description:
              scheduleForm.description.trim()
                ? scheduleForm.description.trim()
                : null,
          },
        }
      )


      setScheduleEditSuccess(
        "Session updated successfully."
      )


      await loadSchedule()


      setTimeout(() => {
        setEditingSchedule(null)
      }, 600)

    } catch (err) {
      console.error(
        "Failed to update schedule:",
        err
      )


      setScheduleEditError(
        err?.message ||
        "Unable to update this session."
      )

    } finally {
      setSavingSchedule(false)
    }
  }


  // =========================================================
  // DELETE SCHEDULE
  // =========================================================

  const handleDeleteSchedule = async (
    session
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${session.title}" from the event schedule?`
      )


    if (!confirmed) {
      return
    }


    setScheduleDeleteError("")

    setDeletingScheduleId(
      session.id
    )


    try {
      await apiRequest(
        `/api/events/${id}/schedules/${session.id}`,
        {
          method: "DELETE",
        }
      )


      setSchedule(
        (current) =>
          current.filter(
            (item) =>
              Number(item.id) !==
              Number(session.id)
          )
      )


      setScheduleEditSuccess(
        "Session deleted successfully."
      )

    } catch (err) {
      console.error(
        "Failed to delete schedule:",
        err
      )


      setScheduleDeleteError(
        err?.message ||
        "Unable to delete this session."
      )

    } finally {
      setDeletingScheduleId(null)
    }
  }


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

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


        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />


            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading event...
            </p>

          </div>

        </main>

      </div>
    )
  }


  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50">

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


        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">

            <h1 className="text-xl font-bold text-red-800">
              Unable to load event
            </h1>


            <p className="mt-3 text-sm leading-6 text-red-600">
              {error ||
                "The requested event could not be found."}
            </p>


            <Link
              to="/events"
              className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Events
            </Link>

          </div>

        </main>

      </div>
    )
  }


  // =========================================================
  // CAPACITY
  // =========================================================

  const capacity =
    Number(
      event.max_attendees || 0
    )


  const seatsLeft =
    Math.max(
      capacity -
        attendeeCount,
      0
    )


  const registrationPercentage =
    capacity > 0
      ? Math.min(
          (attendeeCount /
            capacity) *
            100,
          100
        )
      : 0


  // =========================================================
  // PAGE
  // =========================================================

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

                <span className="inline-flex rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                  {event.category}
                </span>


                <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {event.title}
                </h1>


                <p className="mt-5 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
                  {event.description}
                </p>


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

                    {attendeeCount} registered

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


            {/* =================================================
                ABOUT
            ================================================== */}

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


            {/* =================================================
                REAL SCHEDULE
            ================================================== */}

            <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

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


                {isOrganizer && (

                  <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
                    Organizer controls enabled
                  </div>

                )}

              </div>


              {scheduleEditSuccess && (

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />


                    <p className="text-sm font-semibold text-emerald-700">
                      {scheduleEditSuccess}
                    </p>

                  </div>

                </div>

              )}


              {scheduleDeleteError && (

                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                  <p className="text-sm font-semibold text-red-700">
                    Unable to delete session
                  </p>


                  <p className="mt-1 text-xs text-red-600">
                    {scheduleDeleteError}
                  </p>

                </div>

              )}


              {scheduleLoading ? (

                <div className="mt-8 rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-12 text-center">

                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />


                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Loading schedule...
                  </p>

                </div>

              ) : scheduleError ? (

                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

                  <p className="text-sm font-semibold text-red-700">
                    Unable to load schedule
                  </p>


                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {scheduleError}
                  </p>

                </div>

              ) : schedule.length === 0 ? (

                <div className="mt-8 rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-12 text-center">

                  <Clock3 className="mx-auto h-7 w-7 text-violet-400" />


                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No schedule available
                  </p>


                  <p className="mt-1 text-xs text-slate-500">
                    The organizer has not added any sessions yet.
                  </p>

                </div>

              ) : (

                <div className="mt-8 space-y-0">

                  {schedule.map(
                    (
                      session,
                      index
                    ) => (

                      <div
                        key={
                          session.id ||
                          `${session.session_order}-${session.title}`
                        }
                        className="relative grid gap-4 sm:grid-cols-[100px_1fr]"
                      >

                        <div className="relative sm:text-right">

                          <p className="text-sm font-semibold text-slate-700">
                            {session.time}
                          </p>


                          {index !==
                            schedule.length - 1 && (

                            <div className="absolute left-[50px] top-8 hidden h-[calc(100%+16px)] w-px bg-violet-100 sm:block" />

                          )}

                        </div>


                        <div className="relative pb-8">

                          <div className="absolute -left-[8px] top-1 hidden h-3 w-3 rounded-full border-2 border-white bg-violet-600 shadow-sm sm:block" />


                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:ml-3">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                              <div className="min-w-0">

                                <h3 className="font-semibold text-slate-950">
                                  {session.title}
                                </h3>


                                {session.description ? (

                                  <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {session.description}
                                  </p>

                                ) : (

                                  <p className="mt-2 text-sm italic text-slate-400">
                                    No session description provided.
                                  </p>

                                )}

                              </div>


                              {isOrganizer && (

                                <div className="flex shrink-0 items-center gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openScheduleEditor(
                                        session
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                                  >

                                    <Pencil className="h-3.5 w-3.5" />

                                    Edit

                                  </button>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteSchedule(
                                        session
                                      )
                                    }
                                    disabled={
                                      deletingScheduleId ===
                                      session.id
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >

                                    {deletingScheduleId ===
                                    session.id ? (

                                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

                                    ) : (

                                      <Trash2 className="h-3.5 w-3.5" />

                                    )}

                                    Delete

                                  </button>

                                </div>

                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* =================================================
                LOCATION
            ================================================== */}

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


              {/* REGISTRATION HEADER */}

              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">

                <p className="text-sm font-medium text-white/75">
                  Registration
                </p>


                <p className="mt-2 text-3xl font-bold">
                  {attendeeCount}
                </p>


                <p className="mt-1 text-sm text-white/75">
                  people registered
                </p>

              </div>


              <div className="p-6">


                {/* AVAILABILITY */}

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
                    {attendeeCount}/{capacity}
                  </span>

                </div>


                {/* PROGRESS */}

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-50">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{
                      width:
                        `${registrationPercentage}%`,
                    }}
                  />

                </div>


                {/* SUCCESS */}

                {registrationSuccess && (

                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                    <div className="flex items-start gap-2">

                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />


                      <div>

                        <p className="text-sm font-semibold text-emerald-700">
                          Registration confirmed
                        </p>


                        <p className="mt-1 text-xs leading-5 text-emerald-600">
                          You are registered for this event.
                        </p>

                      </div>

                    </div>

                  </div>

                )}


                {/* ERROR */}

                {registrationError && (

                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm font-semibold text-red-700">
                      Registration failed
                    </p>


                    <p className="mt-1 text-xs leading-5 text-red-600">
                      {registrationError}
                    </p>

                  </div>

                )}


                {/* REGISTER BUTTON */}

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={
                    seatsLeft === 0 ||
                    registering ||
                    alreadyRegistered
                  }
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >

                  {registering ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Registering...
                    </>

                  ) : alreadyRegistered ? (

                    <>
                      <CheckCircle2 className="h-4 w-4" />

                      Registered
                    </>

                  ) : (

                    <>
                      <CheckCircle2 className="h-4 w-4" />

                      {seatsLeft > 0
                        ? "Register Now"
                        : "Event Full"}
                    </>

                  )}

                </button>


                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  Registration is currently open. You can manage your
                  registration later from My Registrations.
                </p>


                <div className="my-6 border-t border-slate-100" />


                {/* EVENT DETAILS */}

                <div className="space-y-4">


                  {/* DATE */}

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


                  {/* TIME */}

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


                  {/* LOCATION */}

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


                {/* ORGANIZER */}

                <div className="mt-6 rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-400">
                    Organized by
                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {event.organizer_name}
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>


      {/* =====================================================
          EDIT SCHEDULE MODAL
      ====================================================== */}

      {editingSchedule && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">


            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-violet-50 to-indigo-50 px-6 py-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Organizer
                </p>


                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Edit Session
                </h2>


                <p className="mt-1 text-sm text-slate-500">
                  Update the selected schedule session.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  closeScheduleEditor
                }
                disabled={
                  savingSchedule
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-950 disabled:opacity-50"
              >

                <X className="h-5 w-5" />

              </button>

            </div>


            {/* BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">

              {scheduleEditError && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                  <p className="text-sm font-semibold text-red-700">
                    Unable to update session
                  </p>


                  <p className="mt-1 text-xs text-red-600">
                    {scheduleEditError}
                  </p>

                </div>

              )}


              {scheduleEditSuccess && (

                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                  <p className="text-sm font-semibold text-emerald-700">
                    {scheduleEditSuccess}
                  </p>

                </div>

              )}


              <div className="grid gap-5 md:grid-cols-2">


                {/* SESSION ORDER */}

                <div>

                  <label
                    htmlFor="schedule-order"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Session order
                  </label>


                  <input
                    id="schedule-order"
                    type="number"
                    min="1"
                    value={
                      scheduleForm.session_order
                    }
                    onChange={(event) =>
                      handleScheduleFormChange(
                        "session_order",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                  />

                </div>


                {/* TITLE */}

                <div>

                  <label
                    htmlFor="schedule-title"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Session title
                  </label>


                  <input
                    id="schedule-title"
                    type="text"
                    value={
                      scheduleForm.title
                    }
                    onChange={(event) =>
                      handleScheduleFormChange(
                        "title",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                  />

                </div>


                {/* START TIME */}

                <div>

                  <label
                    htmlFor="schedule-start"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Start time
                  </label>


                  <input
                    id="schedule-start"
                    type="time"
                    value={
                      scheduleForm.start_time
                    }
                    onChange={(event) =>
                      handleScheduleFormChange(
                        "start_time",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                  />

                </div>


                {/* END TIME */}

                <div>

                  <label
                    htmlFor="schedule-end"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    End time
                  </label>


                  <input
                    id="schedule-end"
                    type="time"
                    value={
                      scheduleForm.end_time
                    }
                    onChange={(event) =>
                      handleScheduleFormChange(
                        "end_time",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="schedule-description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>


                  <textarea
                    id="schedule-description"
                    rows="5"
                    value={
                      scheduleForm.description
                    }
                    onChange={(event) =>
                      handleScheduleFormChange(
                        "description",
                        event.target.value
                      )
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                  />

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeScheduleEditor
                }
                disabled={
                  savingSchedule
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleSaveSchedule
                }
                disabled={
                  savingSchedule
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {savingSchedule ? (

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                ) : (

                  <Save className="h-4 w-4" />

                )}


                {savingSchedule
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
// NORMALIZE EVENT
// =========================================================

function normalizeEvent(event) {
  return {
    ...event,

    id:
      event.id,

    title:
      event.title ||
      "Untitled Event",

    category:
      event.category ||
      "Technology",

    description:
      event.description ||
      "",

    cover_image:
      event.cover_image ||
      null,

    event_date:
      event.event_date,

    start_time:
      event.start_time,

    end_time:
      event.end_time,

    location:
      event.location ||
      "Location unavailable",

    max_attendees:
      Number(
        event.max_attendees || 0
      ),

    organizer_id:
      event.organizer_id,

    organizer_name:
      event.organizer_name ||
      "Event Organizer",

    attendee_count:
      Number(
        event.attendee_count || 0
      ),

    date:
      formatEventDate(
        event.event_date
      ),

    time:
      formatTimeRange(
        event.start_time,
        event.end_time
      ),

    image:
      getEventGradient(
        event.id
      ),
  }
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
// TIME RANGE
// =========================================================

function formatTimeRange(
  startTime,
  endTime
) {
  if (!startTime) {
    return "Time unavailable"
  }


  const start =
    formatTime(
      startTime
    )


  const end =
    endTime
      ? formatTime(endTime)
      : ""


  return end
    ? `${start} – ${end}`
    : start
}


// =========================================================
// TIME FORMATTER
// =========================================================

function formatTime(
  timeValue
) {
  if (!timeValue) {
    return ""
  }


  const [
    hours,
    minutes,
  ] = String(timeValue)
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


// =========================================================
// EVENT GRADIENT
// =========================================================

function getEventGradient(
  eventId
) {
  const gradients = [
    "from-indigo-600 via-violet-600 to-purple-900",
    "from-blue-600 via-indigo-600 to-violet-900",
    "from-cyan-500 via-blue-600 to-indigo-900",
    "from-violet-600 via-purple-600 to-fuchsia-900",
  ]


  const index =
    Number(eventId || 1) %
    gradients.length


  return gradients[index]
}


export default EventDetails