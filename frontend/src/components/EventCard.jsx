import { CalendarDays, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"

function EventCard({ event }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">

      {/* Event image */}
      <div className={`relative h-52 overflow-hidden ${event.image}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur">
          {event.category}
        </span>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-medium">{event.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-slate-950">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2.5">

          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <Users className="h-4 w-4 shrink-0" />
            <span>{event.attendees} attendees</span>
          </div>

        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          <div>
            <p className="text-xs text-slate-400">Organized by</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {event.organizer}
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