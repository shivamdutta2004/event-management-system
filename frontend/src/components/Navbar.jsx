import { Link, NavLink } from "react-router-dom"
import { CalendarDays, Menu, X } from "lucide-react"
import { useState } from "react"

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-slate-950 font-medium"
        : "text-slate-600 hover:text-slate-950"
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
            <CalendarDays className="h-5 w-5" />
          </div>

          <span className="text-lg font-semibold tracking-tight text-slate-950">
            Evently
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>

          <NavLink to="/my-registrations" className={navLinkClass}>
            My Registrations
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Events
            </NavLink>

            <NavLink
              to="/my-registrations"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              My Registrations
            </NavLink>

            <div className="mt-3 border-t border-slate-200 pt-3">
              <Link
                to="/login"
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="mt-1 block rounded-lg bg-slate-950 px-3 py-2.5 text-center text-sm font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar