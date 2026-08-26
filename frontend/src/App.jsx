import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"

import { useEffect } from "react"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Events from "./pages/Events"
import EventDetails from "./pages/EventDetails"

import Login from "./pages/Login"
import Register from "./pages/Register"

import CreateEvent from "./pages/CreateEvent"
import EditEvent from "./pages/EditEvent"

import MyRegistrations from "./pages/MyRegistrations"
import OrganizerDashboard from "./pages/OrganizerDashboard"
import Profile from "./pages/Profile"

import About from "./pages/About"
import Contact from "./pages/Contact"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"


function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}


function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        <Route element={<MainLayout />}>

          {/* Home */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* Events */}

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />


          {/* Authentication */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* Event Management */}

          <Route
            path="/create-event"
            element={<CreateEvent />}
          />

          <Route
            path="/edit-event/:id"
            element={<EditEvent />}
          />


          {/* Attendee */}

          <Route
            path="/my-registrations"
            element={<MyRegistrations />}
          />


          {/* Organizer */}

          <Route
            path="/organizer/dashboard"
            element={<OrganizerDashboard />}
          />


          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* Company / Legal Pages */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}


export default App