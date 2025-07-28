export interface Ticket {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  created_at: string
  done_at?: string
  user?: { name: string }
}

export type TicketStatus = Ticket["status"]
export type TicketPriority = Ticket["priority"]
