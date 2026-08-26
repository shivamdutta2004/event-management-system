import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"


function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-950">

      <Navbar />

      <main>
        <Outlet />
      </main>

    </div>
  )
}


export default MainLayout