import {
  CalendarDays,
  ChevronDown,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react"

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  useEffect,
  useState,
} from "react"

import {
  apiRequest,
  getToken,
  removeToken,
} from "../lib/api"


const API_BASE_URL =
  "http://127.0.0.1:8000"


function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [user, setUser] =
    useState(null)

  const [loadingUser, setLoadingUser] =
    useState(true)

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false)


  // =========================================================
  // NAVIGATION LINK STYLE
  // =========================================================

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "font-medium text-slate-950"
        : "text-slate-600 hover:text-slate-950"
    }`


  // =========================================================
  // PROFILE IMAGE URL
  // =========================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("blob:")
    ) {
      return imagePath
    }

    return `${API_BASE_URL}${imagePath}`
  }


  // =========================================================
  // LOAD AUTHENTICATED USER
  // =========================================================

  useEffect(() => {
    let cancelled = false


    const loadCurrentUser = async () => {
      const token = getToken()


      // -----------------------------------------------------
      // NOT LOGGED IN
      // -----------------------------------------------------

      if (!token) {
        if (!cancelled) {
          setUser(null)
          setLoadingUser(false)
        }

        return
      }


      // -----------------------------------------------------
      // LOAD USER
      // -----------------------------------------------------

      try {
        const userData =
          await apiRequest(
            "/api/auth/me"
          )


        if (!cancelled) {
          setUser(userData)
        }

      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        )

        removeToken()

        if (!cancelled) {
          setUser(null)
        }

      } finally {
        if (!cancelled) {
          setLoadingUser(false)
        }
      }
    }


    setLoadingUser(true)

    loadCurrentUser()


    return () => {
      cancelled = true
    }
  }, [location.pathname])


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    removeToken()

    setUser(null)

    setProfileMenuOpen(false)
    setMobileMenuOpen(false)

    navigate("/login")
  }


  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }


  // =========================================================
  // GET INITIALS
  // =========================================================

  const getInitials = () => {
    if (!user?.full_name) {
      return "U"
    }

    return user.full_name
      .trim()
      .split(/\s+/)
      .map(
        (part) => part[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }


  // =========================================================
  // RENDER AVATAR
  // =========================================================

  const renderAvatar = (
    sizeClass = "h-8 w-8",
    textClass = "text-xs"
  ) => {
    const imageUrl =
      getImageUrl(
        user?.profile_image
      )


    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={
            user?.full_name ||
            "Profile"
          }
          className={`${sizeClass} rounded-lg object-cover`}
          onError={(event) => {
            event.currentTarget.style.display =
              "none"
          }}
        />
      )
    }


    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 ${textClass} font-bold text-white`}
      >
        {getInitials()}
      </div>
    )
  }


  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={closeMobileMenu}
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">

            <CalendarDays className="h-5 w-5" />

          </div>


          <span className="text-lg font-semibold tracking-tight text-slate-950">
            Evently
          </span>

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>


          <NavLink
            to="/events"
            className={navLinkClass}
          >
            Events
          </NavLink>


          <NavLink
            to="/my-registrations"
            className={navLinkClass}
          >
            My Registrations
          </NavLink>


          {user?.role ===
            "organizer" && (

            <NavLink
              to="/organizer/dashboard"
              className={navLinkClass}
            >
              Dashboard
            </NavLink>

          )}

        </nav>


        {/* =================================================
            DESKTOP AUTH ACTIONS
        ================================================== */}

        <div className="relative hidden items-center gap-3 md:flex">

          {loadingUser ? (

            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />

          ) : user ? (

            <>

              {/* Profile button */}

              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen(
                    (current) =>
                      !current
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-indigo-200 hover:bg-indigo-50/50"
              >

                {renderAvatar(
                  "h-8 w-8",
                  "text-xs"
                )}


                <span className="max-w-32 truncate text-sm font-semibold text-slate-700">
                  {user.full_name}
                </span>


                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition ${
                    profileMenuOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>


              {/* Profile dropdown */}

              {profileMenuOpen && (

                <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

                  <div className="border-b border-slate-100 px-3 py-3">

                    <div className="flex items-center gap-3">

                      {renderAvatar(
                        "h-10 w-10",
                        "text-sm"
                      )}


                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-950">
                          {user.full_name}
                        </p>


                        <p className="mt-1 truncate text-xs text-slate-500">
                          {user.email}
                        </p>

                      </div>

                    </div>


                    <p className="mt-2 text-xs font-medium capitalize text-indigo-600">
                      {user.role}
                    </p>

                  </div>


                  <Link
                    to="/profile"
                    onClick={() =>
                      setProfileMenuOpen(
                        false
                      )
                    }
                    className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >

                    <User className="h-4 w-4" />

                    Profile

                  </Link>


                  {user.role ===
                    "organizer" && (

                    <Link
                      to="/organizer/dashboard"
                      onClick={() =>
                        setProfileMenuOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                    >

                      <CalendarDays className="h-4 w-4" />

                      Organizer Dashboard

                    </Link>

                  )}


                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >

                    <LogOut className="h-4 w-4" />

                    Logout

                  </button>

                </div>

              )}

            </>

          ) : (

            <>

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

            </>

          )}

        </div>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) =>
                !current
            )
          }
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


      {/* =================================================
          MOBILE NAVIGATION
      ================================================== */}

      {mobileMenuOpen && (

        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">

          <nav className="flex flex-col gap-1">

            <NavLink
              to="/"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Home
            </NavLink>


            <NavLink
              to="/events"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Events
            </NavLink>


            <NavLink
              to="/my-registrations"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              My Registrations
            </NavLink>


            {user?.role ===
              "organizer" && (

              <NavLink
                to="/organizer/dashboard"
                onClick={
                  closeMobileMenu
                }
                className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </NavLink>

            )}


            <div className="mt-3 border-t border-slate-200 pt-3">

              {user ? (

                <>

                  {/* Mobile user info */}

                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3">

                    {renderAvatar(
                      "h-10 w-10",
                      "text-sm"
                    )}


                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-950">
                        {user.full_name}
                      </p>


                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>

                    </div>

                  </div>


                  <Link
                    to="/profile"
                    onClick={
                      closeMobileMenu
                    }
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                  >

                    <User className="h-4 w-4" />

                    Profile

                  </Link>


                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >

                    <LogOut className="h-4 w-4" />

                    Logout

                  </button>

                </>

              ) : (

                <>

                  <Link
                    to="/login"
                    onClick={
                      closeMobileMenu
                    }
                    className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Log in
                  </Link>


                  <Link
                    to="/register"
                    onClick={
                      closeMobileMenu
                    }
                    className="mt-1 block rounded-lg bg-slate-950 px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>

                </>

              )}

            </div>

          </nav>

        </div>

      )}

    </header>
  )
}


export default Navbar