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

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/create-event"
            element={<CreateEvent />}
          />

          <Route
            path="/edit-event/:id"
            element={<EditEvent />}
          />

          <Route
            path="/my-registrations"
            element={<MyRegistrations />}
          />

          <Route
            path="/organizer/dashboard"
            element={<OrganizerDashboard />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App