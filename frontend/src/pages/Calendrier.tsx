import SimpleCalendar from '../components/SimpleCalendar';

const tickets = [
  { id: 1, date: '2025-07-01', title: 'Ticket 1' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 3, date: '2025-07-02', title: 'Ticket 3' },
  { id: 4, date: '2024-07-02', title: 'Ticket 4' },
  { id: 5, date: '2024-07-02', title: 'Ticket 5' },
  { id: 1, date: '2025-07-01', title: 'Ticket 1' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 3, date: '2025-07-02', title: 'Ticket 3' },
  { id: 4, date: '2024-07-02', title: 'Ticket 4' },
  { id: 5, date: '2024-07-02', title: 'Ticket 5' },  { id: 1, date: '2025-07-01', title: 'Ticket 1' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 3, date: '2025-07-02', title: 'Ticket 3' },
  { id: 4, date: '2024-07-02', title: 'Ticket 4' },
  { id: 5, date: '2024-07-02', title: 'Ticket 5' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 3, date: '2025-07-02', title: 'Ticket 3' },
  { id: 4, date: '2024-07-02', title: 'Ticket 4' },
  { id: 5, date: '2024-07-02', title: 'Ticket 5' },  { id: 1, date: '2025-07-01', title: 'Ticket 1' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 2, date: '2025-07-01', title: 'Ticket 2' },
  { id: 3, date: '2025-07-02', title: 'Ticket 3' },
  { id: 4, date: '2024-07-02', title: 'Ticket 4' },
  { id: 5, date: '2024-07-02', title: 'Ticket 5' },
];

export default function Calendrier() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Calendrier des tickets</h2>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex' }}>
        <SimpleCalendar tickets={tickets} />
      </div>
    </div>
  );
} 