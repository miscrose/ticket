
import React from "react"
import { useState } from "react"
import { useTickets } from "../hooks/useTickets"
import { KanbanColumn } from "./KanbanColumn"
import { TicketModal } from "./TicketModal"
import { TicketFormModal } from "./TicketFormModal";
import type { Ticket, TicketStatus } from "../types/ticket"
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input"
const columns = [
  { id: "todo" as const, title: "À faire", color: "bg-blue-50 border-blue-200" },
  { id: "in-progress" as const, title: "En cours", color: "bg-orange-50 border-orange-200" },
  { id: "done" as const, title: "Terminé", color: "bg-green-50 border-green-200" },
]

export function KanbanBoard() {
  const { tickets, moveTicket, addTicket, searchItem, setSearchItem, filterSearch } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [draggedTicket, setDraggedTicket] = useState<string | null>(null)

  const handleCreateTicket = async (data: any) => {
    try {
      const response =   await axios.post("http://127.0.0.1:8000/api/store", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      toast.success("Ticket créé !");
      const ticket = response.data;
      addTicket(ticket);
    } catch (err) {
      toast.error("Erreur lors de la création du ticket");
    }




    
  };

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    setDraggedTicket(ticketId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async(e: React.DragEvent, status: TicketStatus) => {
    e.preventDefault()
    if (draggedTicket) {
      const ticket = tickets.find((t) => t.id === draggedTicket)
      if (ticket && ticket.status !== status) {

        try {
           await axios.put(`http://127.0.0.1:8000/api/ticket_status_update/${ticket.id}`, 
            { status }, 
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
              },
            }
          );
          moveTicket(draggedTicket, status);
          toast.success("Ticket déplacé !");
        } catch (err) {
          toast.error("Erreur lors du déplacement du ticket");
        }

    
      }
      setDraggedTicket(null)
    }
  }

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="mb-6 flex items-center justify-between gap-4">
      <Input placeholder="Rechercher par titre " value={searchItem} onChange={(e) => setSearchItem(e.target.value)} className="w-1/2" />
        <TicketFormModal onSubmit={handleCreateTicket} />
      
      </div>
      <Toaster />
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-0 items-stretch">
        {columns.map((column) => {
          const columnTickets = filterSearch().filter((ticket) => ticket.status === column.id)

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tickets={columnTickets}
              draggedTicket={draggedTicket}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onViewDetails={handleViewDetails}
            />
          )
        })}
      </div>

      <TicketModal ticket={selectedTicket} isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  )
}
