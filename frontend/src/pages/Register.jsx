import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState("attendee")

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT PANEL
        ====================================================== */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 px-10 py-14 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative">

            {/* Brand */}
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-lg">
                <CalendarDays className="h-5 w-5" />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Evently
              </span>
            </Link>

            {/* Content */}
            <div className="mt-20 max-w-lg">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Join Evently
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight xl:text-5xl">
                Discover events.
                <span className="block text-indigo-200">
                  Create experiences.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-indigo-100">
                Create your account to discover events, manage
                registrations, or start organizing experiences for
                your community.
              </p>

              <div className="mt-8 space-y-3">

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Discover events that match your interests
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Keep all your registrations in one place
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Create and manage your own events
                </div>

              </div>

            </div>

          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-3 gap-6 border-t border-white/10 pt-8">

            <div>
              <p className="text-2xl font-bold">
                500+
              </p>

              <p className="mt-1 text-sm text-indigo-200">
                Events
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                10K+
              </p>

              <p className="mt-1 text-sm text-indigo-200">
                Participants
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                100+
              </p>

              <p className="mt-1 text-sm text-indigo-200">
                Organizers
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">

          <div className="w-full max-w-xl">

            {/* Mobile brand */}
            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <span className="text-xl font-semibold tracking-tight text-slate-950">
                  Evently
                </span>
              </Link>

            </div>

            {/* Header */}
            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Join Evently and start discovering or organizing events.
              </p>

            </div>

            {/* Form */}
            <form className="mt-8 space-y-5">

              {/* Name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />

              </div>

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />

              </div>

              {/* Account type */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account type
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* Attendee */}
                  <button
                    type="button"
                    onClick={() => setRole("attendee")}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      role === "attendee"
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <p className="text-sm font-semibold">
                        Attendee
                      </p>

                      {role === "attendee" && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}

                    </div>

                    <p
                      className={`mt-1 text-xs ${
                        role === "attendee"
                          ? "text-indigo-100"
                          : "text-slate-500"
                      }`}
                    >
                      Discover & register
                    </p>
                  </button>

                  {/* Organizer */}
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      role === "organizer"
                        ? "border-violet-500 bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <p className="text-sm font-semibold">
                        Organizer
                      </p>

                      {role === "organizer" && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}

                    </div>

                    <p
                      className={`mt-1 text-xs ${
                        role === "organizer"
                          ? "text-violet-100"
                          : "text-slate-500"
                      }`}
                    >
                      Create & manage
                    </p>
                  </button>

                </div>
              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters with a mix of letters,
                  numbers and symbols.
                </p>

              </div>

              {/* Confirm password */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Terms */}
              <label className="flex items-start gap-3">

                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />

                <span className="text-sm leading-6 text-slate-500">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>

              </label>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:from-indigo-700 hover:to-violet-700"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Log in
              </Link>
            </p>

            {/* Security note */}
            <div className="mt-7 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-center">
              <p className="text-xs leading-5 text-violet-700">
                Your account information will be securely stored and
                authenticated through Evently's backend.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Register