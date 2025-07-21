

import { useState, useEffect, useCallback } from "react"
import type { Ticket, TicketStatus } from "../types/ticket"
import axios from "axios";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/show_ticket", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
    

console.log(response.data)

        setTickets(response.data.tickets); 
      } catch (err) {       
    
        console.error("Erreur lors du chargement des tickets", err);
      }
    };
    fetchTickets();
  }, []);

  const addTicket = useCallback((ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  }, []);

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, ...updates } : ticket)))
  }, [])

  const deleteTicket = useCallback((id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id))
  }, [])

  const moveTicket = useCallback(
    (id: string, newStatus: TicketStatus) => {
      updateTicket(id, { status: newStatus })
    },
    [updateTicket],
  )

  return { tickets, addTicket, updateTicket, deleteTicket, moveTicket };
}
