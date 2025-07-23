import React from "react";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog";
import type { Ticket } from "../types/ticket";

interface TicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketModal({ ticket, isOpen, onClose }: TicketModalProps) {
  if (!ticket) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{ticket.title}</h3>
            <p className="text-gray-600 text-sm">{ticket.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              Priorité: {ticket.priority}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status === "todo" ? "À faire" : ticket.status === "in-progress" ? "En cours" : "Terminé"}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {ticket.user && <p>Assigné à: {ticket.user.name}</p>}
            <p>Créé le: {new Date(ticket.created_at).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
        <DialogClose asChild>
          <button className="mt-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Fermer</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
