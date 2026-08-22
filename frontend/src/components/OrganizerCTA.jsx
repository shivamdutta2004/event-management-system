import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

function OrganizerCTA() {
  return (
    <section className="bg-slate-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-10 sm:py-16 lg:px-16">

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300">
                <Sparkles className="h-4 w-4" />
                For event organizers
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Turn your next event into an experience.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Create events, manage schedules, track registrations and
                communicate with attendees from one simple platform.
              </p>

            </div>

            <Link
              to="/create-event"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Create an Event
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}

export default OrganizerCTA