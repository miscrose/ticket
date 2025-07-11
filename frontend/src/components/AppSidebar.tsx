import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { IconMenu2, IconDashboard, IconListDetails, IconUsers } from "@tabler/icons-react"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Tickets", url: "/dashboard/tickets", icon: IconListDetails },
  { title: "Profil", url: "/dashboard/profile", icon: IconUsers },
]

export function AppSidebar() {
  const [open, setOpen] = useState(true)
  const location = useLocation()

  return (
    <aside
      className={`bg-black text-white h-screen flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
      style={{ minWidth: open ? 256 : 64 }}
    >
      <div className={`flex items-center p-4 border-b border-gray-800 ${open ? "justify-between" : "justify-center"}`}>
        {open && (
          <span className="text-xl font-bold transition-all duration-300">MonApp</span>
        )}
        <button
          className="p-1 rounded hover:bg-gray-800"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Réduire la sidebar" : "Étendre la sidebar"}
        >
          <IconMenu2 size={20} />
        </button>
      </div>
      <nav className="flex-1 p-2 overflow-x-visible">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.url}
                className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition ${
                  location.pathname === item.url ? "bg-gray-800" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span
                  className={`transition-all duration-300 whitespace-nowrap ${
                    open ? "opacity-100 ml-2 w-auto" : "opacity-0 w-0 ml-0"
                  }`}
                  style={{ transitionProperty: "opacity, width" }}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {open && (
        <div
          className="p-4 border-t border-gray-800 text-sm transition-all duration-300"
          style={{ transitionProperty: "opacity, width" }}
        >
          Utilisateur connecté
        </div>
      )}
    </aside>
  )
}