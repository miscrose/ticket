import { AppSidebar } from "@/components/AppSidebar"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 bg-gray-100 p-8 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}