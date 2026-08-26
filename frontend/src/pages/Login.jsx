import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react"

import {
  Link,
  useNavigate,
} from "react-router-dom"

import { useState } from "react"

import {
  apiRequest,
  saveToken,
} from "../lib/api"


function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")

    if (!email.trim() || !password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)

    try {
      const data = await apiRequest(
        "/api/auth/login",
        {
          method: "POST",
          body: {
            email: email.trim(),
            password,
          },
        }
      )

      // Save JWT token for future API requests
      saveToken(data.access_token)

      // Redirect according to user role
      if (data.user?.role === "organizer") {
        navigate("/organizer/dashboard")
      } else {
        navigate("/events")
      }

    } catch (error) {
      console.error("Login failed:", error)

      setError(
        error?.message ||
        "Invalid email or password."
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT PANEL
        ====================================================== */}

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 px-10 py-14 text-white lg:flex lg:flex-col lg:justify-between">

          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative">

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


            <div className="mt-20 max-w-lg">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome back
              </div>


              <h1 className="mt-5 text-4xl font-bold tracking-tight xl:text-5xl">
                Your next experience
                <span className="block text-indigo-200">
                  is waiting for you.
                </span>
              </h1>


              <p className="mt-6 max-w-md text-base leading-7 text-indigo-100">
                Sign in to discover upcoming events, manage your
                registrations, or organize your next experience.
              </p>


              <div className="mt-8 space-y-3">

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Discover workshops and conferences
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Manage all your registrations
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Create and manage your own events
                </div>

              </div>

            </div>

          </div>


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

          <div className="w-full max-w-md">

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
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Sign in to Evently
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Access your events, registrations and organizer tools.
              </p>

            </div>


            {/* Error */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                />

              </div>


              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800 hover:underline"
                  >
                    Forgot password?
                  </a>

                </div>


                <div className="relative">

                  <input
                    id="login-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              </div>


              {/* Remember */}

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />

                <span className="text-sm text-slate-600">
                  Remember me
                </span>

              </label>


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}

              </button>

            </form>


            {/* Register */}

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Create an account
              </Link>
            </p>


            {/* Security note */}

            <div className="mt-7 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-center">

              <p className="text-xs leading-5 text-indigo-700">
                Your account will be securely authenticated through
                Evently's backend.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


export default Login