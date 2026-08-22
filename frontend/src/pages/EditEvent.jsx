import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"

import { mockEvents } from "../data/mockData"

function EditEvent() {
  const { id } = useParams()

  const eventFromData =
    mockEvents.find((item) => item.id === Number(id)) ||
    mockEvents[0]

  const [event, setEvent] = useState({
    title: eventFromData.title,
    category: eventFromData.category,
    description:
      eventFromData.description ||
      "Join us for an engaging event designed to provide practical knowledge, useful insights and meaningful connections.",
    date: "2026-08-28",
    startTime: eventFromData.startTime || "10:00",
    endTime: eventFromData.endTime || "16:30",
    location: eventFromData.location,
    capacity: String(eventFromData.capacity || 100),
  })

  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Welcome & Introduction",
      startTime: "10:00",
      endTime: "11:00",
      description:
        "Opening session, event overview and introduction to the speakers.",
    },
    {
      id: 2,
      title: "Introduction to Artificial Intelligence",
      startTime: "11:00",
      endTime: "12:30",
      description:
        "Understand the fundamentals of AI and its applications across industries.",
    },
    {
      id: 3,
      title: "Lunch & Networking",
      startTime: "12:30",
      endTime: "14:00",
      description:
        "Take a break, connect with other participants and exchange ideas.",
    },
  ])

  const [imagePreview, setImagePreview] = useState(null)

  const updateEvent = (field, value) => {
    setEvent((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateSession = (id, field, value) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? { ...session, [field]: value }
          : session
      )
    )
  }

  const addSession = () => {
    setSessions((current) => [
      ...current,
      {
        id: Date.now(),
        title: "",
        startTime: "",
        endTime: "",
        description: "",
      },
    ])
  }

  const removeSession = (id) => {
    setSessions((current) =>
      current.filter((session) => session.id !== id)
    )
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setImagePreview(URL.createObjectURL(file))
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/organizer/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mt-7">

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700">
              Organizer · Event #{id}
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Edit event
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Update your event information, schedule and registration
              settings before saving your changes.
            </p>

          </div>
        </div>
      </section>

      {/* =====================================================
          FORM
      ====================================================== */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="space-y-8">

          {/* =================================================
              BASIC INFORMATION
          ================================================== */}
          <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">

            <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Basic information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the main information attendees see about your
                    event.
                  </p>
                </div>

              </div>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">

              {/* Title */}
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Event title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  value={event.title}
                  onChange={(e) =>
                    updateEvent("title", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="edit-category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <select
                  id="edit-category"
                  value={event.category}
                  onChange={(e) =>
                    updateEvent("category", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                >
                  <option value="Technology">Technology</option>
                  <option value="Career">Career</option>
                  <option value="Education">Education</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Conferences">Conferences</option>
                  <option value="Creative">Creative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>

                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <button
                    type="button"
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Improve with AI
                  </button>

                </div>

                <textarea
                  id="edit-description"
                  rows="6"
                  value={event.description}
                  onChange={(e) =>
                    updateEvent(
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">

                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

                  <p className="text-xs leading-5 text-violet-700">
                    Use AI to refine the description while keeping your event
                    details and tone.
                  </p>

                </div>

              </div>
            </div>
          </section>

          {/* =================================================
              EVENT COVER
          ================================================== */}
          <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/50 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Plus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Event cover
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Change the visual used for your event.
                  </p>
                </div>

              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">

              <label
                htmlFor="edit-event-image"
                className="group relative block min-h-72 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70"
              >

                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Event cover preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-12">
                      <p className="text-sm font-semibold text-white">
                        Click to change cover image
                      </p>

                      <p className="mt-1 text-xs text-white/70">
                        PNG, JPG or WEBP up to 5 MB
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-72 flex-col items-center justify-center text-center">

                    <div
                      className={`mx-auto h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br ${eventFromData.image}`}
                    />

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      Current event cover
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Click to upload a new image
                    </p>

                  </div>
                )}

              </label>

              <input
                id="edit-event-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>
          </section>

          {/* =================================================
              DATE & LOCATION
          ================================================== */}
          <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">

            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/40 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Date & location
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update when and where the event takes place.
                  </p>
                </div>

              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 sm:px-8 md:grid-cols-2">

              {/* Date */}
              <div>
                <label
                  htmlFor="edit-date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Event date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="edit-date"
                    type="date"
                    value={event.date}
                    onChange={(e) =>
                      updateEvent(
                        "date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />
                </div>
              </div>

              {/* Capacity */}
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
                  value={event.capacity}
                  onChange={(e) =>
                    updateEvent(
                      "capacity",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                />
              </div>

              {/* Start */}
              <div>
                <label
                  htmlFor="edit-start"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Start time
                </label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="edit-start"
                    type="time"
                    value={event.startTime}
                    onChange={(e) =>
                      updateEvent(
                        "startTime",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />
                </div>
              </div>

              {/* End */}
              <div>
                <label
                  htmlFor="edit-end"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  End time
                </label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="edit-end"
                    type="time"
                    value={event.endTime}
                    onChange={(e) =>
                      updateEvent(
                        "endTime",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">

                <label
                  htmlFor="edit-location"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Location
                </label>

                <div className="relative">

                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="edit-location"
                    type="text"
                    value={event.location}
                    onChange={(e) =>
                      updateEvent(
                        "location",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />

                </div>
              </div>

            </div>
          </section>

          {/* =================================================
              SCHEDULE
          ================================================== */}
          <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">

            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/70 via-white to-indigo-50/60 px-6 py-5 sm:px-8">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Event schedule
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Update the sessions and activities in your event.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Improve schedule with AI
                </button>

              </div>

            </div>

            <div className="space-y-5 px-6 py-6 sm:px-8">

              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/40 to-white p-5"
                >

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                        Session {index + 1}
                      </p>

                      <h3 className="mt-1 font-semibold text-slate-950">
                        Event session
                      </h3>

                    </div>

                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeSession(session.id)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Remove session ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    {/* Session title */}
                    <div className="md:col-span-2">

                      <label
                        htmlFor={`edit-session-title-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Session title
                      </label>

                      <input
                        id={`edit-session-title-${session.id}`}
                        type="text"
                        value={session.title}
                        onChange={(e) =>
                          updateSession(
                            session.id,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                    {/* Start */}
                    <div>

                      <label
                        htmlFor={`edit-session-start-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Start time
                      </label>

                      <input
                        id={`edit-session-start-${session.id}`}
                        type="time"
                        value={session.startTime}
                        onChange={(e) =>
                          updateSession(
                            session.id,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                    {/* End */}
                    <div>

                      <label
                        htmlFor={`edit-session-end-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        End time
                      </label>

                      <input
                        id={`edit-session-end-${session.id}`}
                        type="time"
                        value={session.endTime}
                        onChange={(e) =>
                          updateSession(
                            session.id,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">

                      <label
                        htmlFor={`edit-session-description-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Description
                      </label>

                      <textarea
                        id={`edit-session-description-${session.id}`}
                        rows="3"
                        value={session.description}
                        onChange={(e) =>
                          updateSession(
                            session.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSession}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-5 py-3.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
              >
                <Plus className="h-4 w-4" />
                Add another session
              </button>

            </div>
          </section>

          {/* =================================================
              ACTION BAR
          ================================================== */}
          <div className="h-8" />

          <div className="sticky bottom-0 z-20 -mx-4 border-t border-indigo-100 bg-white/95 p-4 shadow-xl shadow-indigo-100/30 backdrop-blur sm:bottom-4 sm:mx-0 sm:rounded-2xl sm:border">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-medium text-slate-700">
                  You're editing a published event.
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Changes will be applied after saving.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

                <Link
                  to={`/events/${id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:from-indigo-700 hover:to-violet-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>

              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default EditEvent