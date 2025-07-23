import  { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, isSameDay, addDays } from 'date-fns';

// TicketCard: affiche juste le titre du ticket
const TicketCard = ({ title }: { title: string }) => (
  <div style={{
    background: '#f5f5f5',
    borderRadius: 4,
    padding: '2px 6px',
    marginBottom: 4,
    fontSize: 13,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    minHeight: 22,
  }}>{title}</div>
);


interface Ticket {
  id: number;
  date: string; // 'YYYY-MM-DD'
  title: string;
}

interface SimpleCalendarProps {
  tickets: Ticket[];
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function SimpleCalendar({ tickets }: SimpleCalendarProps) {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const weekStart = currentWeekStart;
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  
  const days: Date[] = [];
  let day = weekStart;
  for (let i = 0; i < 7; i++) {
    days.push(day);
    day = addDays(day, 1);
  }


  const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));


  const getTicketsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tickets.filter(t => t.date === dateStr);
  };


  const headerLabel = `Semaine du ${format(weekStart, 'dd/MM/yyyy')} au ${format(weekEnd, 'dd/MM/yyyy')}`;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* Header navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={prevWeek} style={{ padding: '4px 10px', fontSize: 16, cursor: 'pointer' }}>{'<'}</button>
        <div style={{ fontWeight: 'bold', fontSize: 18 }}>
          {headerLabel}
        </div>
        <button onClick={nextWeek} style={{ padding: '4px 10px', fontSize: 16, cursor: 'pointer' }}>{'>'}</button>
      </div>
      {/* Jours de la semaine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8, textAlign: 'center', fontWeight: 'bold', color: '#555' }}>
        {days.map((date, idx) => (
          <div key={idx}>
            {DAYS[idx]}<br />
            <span style={{ fontWeight: 'normal', fontSize: 13 }}>{format(date, 'dd/MM')}</span>
          </div>
        ))}
      </div>
      {/* Grille des jours */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, width: '100%', height: '100%' }}>
        {days.map((date, idx) => {
          const isToday = isSameDay(date, today);
          const ticketsForDay = getTicketsForDay(date);
          return (
            <div
              key={idx}
              style={{
                height: '100%',
                flex: '1 1 0',
                minHeight: 0,
                border: '1px solid #e0e0e0',
                background: isToday ? '#e3f2fd' : '#fff',
                color: '#222',
                borderRadius: 6,
                padding: 6,
                boxSizing: 'border-box',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: isToday ? 'bold' : 'normal', marginBottom: 4 }}>
                {format(date, 'd')}
              </div>
              {ticketsForDay.length > 0 && (
                <div
                  style={{
                    flex: '1 1 0',
                    minHeight: 0,
                    overflowY: 'auto',
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {ticketsForDay.map(ticket => (
                    <TicketCard key={ticket.id + ticket.title} title={ticket.title} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimpleCalendar; 