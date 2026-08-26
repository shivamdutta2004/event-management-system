import {
  MapPin,
  Users,
} from "lucide-react"

import { Link } from "react-router-dom"


function EventCard({ event }) {

  const attendeeCount =
    event.attendee_count ??
    event.attendees ??
    0


  const maxAttendees =
    event.max_attendees ??
    event.capacity ??
    0


  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">

      {/* =====================================================
          EVENT IMAGE
      ====================================================== */}

      <div
        className={`relative h-52 overflow-hidden ${
          event.image ||
          "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-900"
        }`}
      >

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />


        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur">
          {event.category || "Technology"}
        </span>


        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-medium">
            {event.date || "Date unavailable"}
          </p>
        </div>

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">

        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-950">
          {event.title || "Untitled Event"}
        </h3>


        <div className="mt-4 space-y-2.5">

          {/* Location */}
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0" />

            <span className="truncate">
              {event.location || "Location unavailable"}
            </span>
          </div>


          {/* Attendees */}
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <Users className="h-4 w-4 shrink-0" />

            <span>
              {attendeeCount} attendees

              {maxAttendees > 0 &&
                ` / ${maxAttendees}`}
            </span>
          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          <div>

            <p className="text-xs text-slate-400">
              Organized by
            </p>

            <p className="mt-0.5 text-sm font-medium text-slate-700">
              Shivam Dutta
            </p>

          </div>


          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View Event
          </Link>

        </div>

      </div>

    </article>
  )
}


export default EventCard