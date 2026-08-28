import { CalendarDays, Mail } from "lucide-react"
import { Link } from "react-router-dom"


function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">


          {/* Brand */}

          <div className="max-w-sm">

            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <CalendarDays className="h-5 w-5" />
              </div>

              <span className="text-lg font-semibold tracking-tight text-slate-950">
                Evently
              </span>
            </Link>


            <p className="mt-4 text-sm leading-6 text-slate-500">
              Discover events, create experiences and manage registrations effortlessly.
            </p>

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

              <Link
                to="/about"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                About
              </Link>


              <Link
                to="/contact"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Contact
              </Link>


              <Link
                to="/privacy"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Privacy
              </Link>


              <Link
                to="/terms"
                className="text-sm text-slate-500 transition hover:text-slate-950"
              >
                Terms
              </Link>

            </nav>

          </div>


          {/* Project */}

          <div>

            <h3 className="text-sm font-semibold text-slate-950">
              Project
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <p className="text-sm leading-6 text-slate-500">
                A full-stack event discovery and management platform.
              </p>


              <Link
                to="/events"
                className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                Explore events →
              </Link>

            </div>

          </div>

        </div>


        {/* Bottom */}

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-400">
            © 2026 Evently. Built by the Evently Team. All rights reserved.
          </p>


          <p className="text-sm text-slate-400">
            Evently — event discovery and management platform.
          </p>

        </div>

      </div>

    </footer>
  )
}


export default Footer