
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import {TicketModal} from "../kanban/components/TicketModal";
import type { Ticket } from "../kanban/types/ticket";

interface SimpleCalendarProps {
  tickets: Ticket[];
}

function CalendarFC({ tickets }: SimpleCalendarProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const events = tickets.map(ticket => ({
    id: String(ticket.id),
    title: ticket.title,
    start: ticket.created_at,
    end: ticket.done_at
    ? new Date(new Date(ticket.done_at).getTime() + 24*60*60*1000).toISOString().slice(0,10)
    : undefined,
    allDay: true,
  
    extendedProps: ticket, 
  }));

  function renderEventContent(arg: any) {
    return (
      <div
        style={{
          cursor: "pointer",
          color: "#111",
          background: "#fff",
          border: "1px solid #111",
          borderRadius: "4px",
          padding: "4px 8px",
          fontWeight: "normal",
          display: "block",
          width: "100%",
          boxSizing: "border-box",
          textAlign: "left"
        }}
        title={arg.event.title}
      >
        {arg.event.title}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        locale={frLocale}
        events={events}
        dayMaxEventRows={3}
        eventContent={renderEventContent}
        eventClick={(info) => {
          setSelectedTicket(info.event.extendedProps as Ticket);
        }}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay"
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour"
        }}
      />
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

export default CalendarFC; 