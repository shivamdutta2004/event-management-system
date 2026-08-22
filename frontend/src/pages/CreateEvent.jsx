import {
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

function CreateEvent() {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    },
  ])

  const [imagePreview, setImagePreview] = useState(null)

  const addSession = () => {
    setSessions((current) => [
      ...current,
      {
        id: Date.now(),
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      },
    ])
  }

  const removeSession = (id) => {
    setSessions((current) =>
      current.filter((session) => session.id !== id)
    )
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
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
            ← Back to dashboard
          </Link>

          <div className="mt-7">

            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700">
              Organizer workspace
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Create an event
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Add your event details, build a schedule and prepare everything
              your attendees need before publishing.
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
                    Tell attendees what your event is about.
                  </p>
                </div>

              </div>

            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">

              {/* Event title */}
              <div>
                <label
                  htmlFor="event-title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Event title
                </label>

                <input
                  id="event-title"
                  type="text"
                  placeholder="e.g. AI & Machine Learning Workshop"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="event-category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <select
                  id="event-category"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="technology">Technology</option>
                  <option value="career">Career</option>
                  <option value="education">Education</option>
                  <option value="workshops">Workshops</option>
                  <option value="conferences">Conferences</option>
                  <option value="creative">Creative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>

                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <label
                    htmlFor="event-description"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <button
                    type="button"
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate with AI
                  </button>

                </div>

                <textarea
                  id="event-description"
                  rows="6"
                  placeholder="Describe your event, what attendees will learn, who should attend, and what makes it valuable..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">

                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

                  <p className="text-xs leading-5 text-violet-700">
                    You can write the description yourself or generate a
                    professional first draft using AI.
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
                    Add a cover image that represents your event.
                  </p>
                </div>

              </div>

            </div>

            <div className="px-6 py-6 sm:px-8">

              <label
                htmlFor="event-image"
                className="group block cursor-pointer"
              >
                <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 transition hover:border-indigo-300">

                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-12">
                        <p className="text-sm font-semibold text-white">
                          Click to change image
                        </p>

                        <p className="mt-1 text-xs text-white/70">
                          PNG, JPG or WEBP up to 5 MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <Plus className="h-6 w-6" />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        Upload event cover
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG or WEBP up to 5 MB
                      </p>

                    </div>
                  )}

                </div>
              </label>

              <input
                id="event-image"
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
                    Let attendees know when and where your event takes place.
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-6 px-6 py-6 sm:px-8 md:grid-cols-2">

              {/* Date */}
              <div>
                <label
                  htmlFor="event-date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Event date
                </label>

                <div className="relative">

                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="event-date"
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />

                </div>
              </div>

              {/* Capacity */}
              <div>
                <label
                  htmlFor="capacity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Maximum attendees
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                />
              </div>

              {/* Start */}
              <div>
                <label
                  htmlFor="start-time"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Start time
                </label>

                <div className="relative">

                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="start-time"
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />

                </div>
              </div>

              {/* End */}
              <div>
                <label
                  htmlFor="end-time"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  End time
                </label>

                <div className="relative">

                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="end-time"
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50"
                  />

                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">

                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Location
                </label>

                <div className="relative">

                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                  <input
                    id="location"
                    type="text"
                    placeholder="e.g. Assam down town University, Guwahati"
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
                      Add the sessions and activities that make up your event.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate schedule with AI
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

                    {/* Title */}
                    <div className="md:col-span-2">

                      <label
                        htmlFor={`session-title-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Session title
                      </label>

                      <input
                        id={`session-title-${session.id}`}
                        type="text"
                        value={session.title}
                        onChange={(event) =>
                          updateSession(
                            session.id,
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Introduction to Machine Learning"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                    {/* Start */}
                    <div>

                      <label
                        htmlFor={`session-start-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Start time
                      </label>

                      <input
                        id={`session-start-${session.id}`}
                        type="time"
                        value={session.startTime}
                        onChange={(event) =>
                          updateSession(
                            session.id,
                            "startTime",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                    {/* End */}
                    <div>

                      <label
                        htmlFor={`session-end-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        End time
                      </label>

                      <input
                        id={`session-end-${session.id}`}
                        type="time"
                        value={session.endTime}
                        onChange={(event) =>
                          updateSession(
                            session.id,
                            "endTime",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/50"
                      />

                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">

                      <label
                        htmlFor={`session-description-${session.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Description
                      </label>

                      <textarea
                        id={`session-description-${session.id}`}
                        rows="3"
                        value={session.description}
                        onChange={(event) =>
                          updateSession(
                            session.id,
                            "description",
                            event.target.value
                          )
                        }
                        placeholder="Briefly describe what happens during this session..."
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

              <p className="hidden text-sm text-slate-500 sm:block">
                You can save your event as a draft before publishing.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:from-indigo-700 hover:to-violet-700"
                >
                  Publish Event
                </button>

              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

export default CreateEvent