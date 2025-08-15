

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import type { Ticket } from "../types/ticket"
import { TicketFormModal } from "./TicketFormModal"

const CalendarIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const EyeIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const PencilIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 11.828a2 2 0 010-2.828L13 5z" />
  </svg>
)

interface TicketCardProps {
  ticket: Ticket
  isDragging?: boolean
  onDragStart: (e: React.DragEvent, ticketId: string) => void
  onViewDetails: (ticket: Ticket) => void
  onEdit: (ticket: Ticket) => void
  onShowComments: (ticketId: string, ticketTitle: string) => void
}

export function TicketCard({ ticket, isDragging, onDragStart, onViewDetails, onEdit, onShowComments }: TicketCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, ticket.id)}
        className={`cursor-move hover:shadow-lg transition-all duration-200 ${
          isDragging ? "opacity-50 rotate-2 scale-105" : ""
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-medium line-clamp-2 flex-1 pr-2">
              {ticket.title}
            </CardTitle>
            <button
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(ticket);
              }}
              title="Modifier le ticket"
              type="button"
            >
              <PencilIcon />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon />
              <span className="ml-1">{new Date(ticket.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
          
          {ticket.user ? (
            <div className="flex items-center text-xs text-gray-600 mb-3">
              <UserIcon />
              <span className="ml-1">{ticket.user.name}</span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-gray-400 mb-3">
              <UserIcon />
              <span className="ml-1">Non assigné</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs bg-transparent hover:bg-white/80"
              onClick={() => onViewDetails(ticket)}
            >
              <EyeIcon />
              <span className="ml-1">Détails</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs bg-transparent hover:bg-white/80"
              onClick={() => onShowComments(ticket.id, ticket.title)}
            >
              💬
              <span className="ml-1">Comms</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <TicketFormModal
        ticket={ticket}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={() => setEditOpen(false)}
      />
    </>
  )
}
