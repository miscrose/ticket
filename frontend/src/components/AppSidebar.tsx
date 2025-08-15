import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { IconMenu2, IconDashboard, IconListDetails, IconUsers } from "@tabler/icons-react"
import axios from 'axios';

const baseNavItems = [
  { title: "Dashboard", url: "/dashboard/ChartPage", icon: IconDashboard },
  { title: "calendrier", url: "/dashboard/calendrier", icon: IconListDetails },
  { title: "Profil", url: "/dashboard/Profil", icon: IconUsers },
  { title: "Kanban", url: "/dashboard/kanban", icon: IconListDetails },
  { title: "Historique des tickets", url: "/dashboard/ticketHistory", icon: IconListDetails },
];

export function AppSidebar() {
  const [navItems, setNavItems] = useState(baseNavItems);
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setNavItems((prev) => {
       
        const existingUrls = new Set(prev.map(item => item.url));
        
       
        if (!existingUrls.has("/dashboard/adminPage")) {
          return [
            ...prev,
            {
              title: "Admin",
              url: "/dashboard/adminPage",
              icon: IconUsers,
            },
          ];
        }
        
       
        return prev;
      });
    }
  }, []); 

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (e) {
      alert('Erreur lors de la déconnexion');
    }
  };

  return (
    <aside
      className={`bg-black text-white h-screen flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
      style={{ minWidth: open ? 256 : 64 }}
    >
      <div className={`flex items-center p-4 border-b border-gray-800 ${open ? "justify-between" : "justify-center"}`}>
        {open && (
          <span className="text-xl font-bold transition-all duration-300">  </span>
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
        
          <button
            onClick={handleLogout} 
            style={{
              
              marginTop: 12,
              width: '100%',
              padding: '8px 0',
              background: '#e53935',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </aside>
  )
}