import { CalendarDays, Mail } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <CalendarDays className="h-5 w-5" />
              </div>

              <span className="text-lg font-semibold tracking-tight text-slate-950">
                Evently
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Discover events, create experiences and manage registrations
              effortlessly.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Instagram
              </a>

              <a
                href="#"
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                LinkedIn
              </a>

              <a
                href="#"
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                X
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Platform
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/events"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Explore Events
              </Link>

              <Link
                to="/create-event"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Create Event
              </Link>

              <Link
                to="/my-registrations"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                My Registrations
              </Link>

              <Link
                to="/organizer/dashboard"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Organizer Dashboard
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Company
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <a
                href="#"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                About
              </a>

              <a
                href="#"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Contact
              </a>

              <a
                href="#"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Privacy
              </a>

              <a
                href="#"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Terms
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Contact
            </h3>

            <div className="mt-4 flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-slate-400" />

              <a
                href="mailto:hello@evently.com"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                hello@evently.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            © 2026 Evently. All rights reserved.
          </p>

          <p className="text-sm text-slate-400">
            Built for better events.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer