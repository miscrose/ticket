import CalendarFC from '../components/SimpleCalendar';
import { useTickets } from '../kanban/hooks/useTickets';

export default function Calendrier() {
  const { tickets } = useTickets();
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex' }}>
        <CalendarFC tickets={tickets} />
      </div>
    </div>
  );
} 