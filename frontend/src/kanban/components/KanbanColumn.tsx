

import React from "react"
import { Badge } from "./ui/Badge"
import { TicketCard } from "./TicketCard"
import type { Ticket, TicketStatus } from "../types/ticket"

interface KanbanColumnProps {
  id: TicketStatus
  title: string
  color: string
  tickets: Ticket[]
  draggedTicket: string | null
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: TicketStatus) => void
  onDragStart: (e: React.DragEvent, ticketId: string) => void
  onViewDetails: (ticket: Ticket) => void
  onEdit: (ticket: Ticket) => void
}

export function KanbanColumn({
  id,
  title,
  color,
  tickets,
  draggedTicket,
  onDragOver,
  onDrop,
  onDragStart,
  onViewDetails,
  onEdit,
}: KanbanColumnProps) {
  return (
    <div
      className={`${color} rounded-lg border-2 border-dashed p-4 h-full transition-colors duration-200 overflow-y-auto flex flex-col`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
   
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
        <Badge variant="secondary" className="bg-white">
          {tickets.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isDragging={draggedTicket === ticket.id}
            onDragStart={onDragStart}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
          />
        ))}

        {tickets.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">Aucun ticket</p>
          </div>
        )}
      </div>
    </div>
  )
}
