import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { addDays, nightsBetween, sameDay, startOfDay } from '../lib/format';

interface Props {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (a: Date | null, b: Date | null) => void;
  months?: number;
  minNights?: number;
}

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DOW_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Calendar({ checkIn, checkOut, onChange, months = 2, minNights = 2 }: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [hover, setHover] = useState<Date | null>(null);

  const pick = (d: Date) => {
    if (d < today) return;
    if (!checkIn || (checkIn && checkOut)) return onChange(d, null);
    if (d <= checkIn) return onChange(d, null);
    if (nightsBetween(checkIn, d) < minNights) return onChange(checkIn, null);
    onChange(checkIn, d);
  };

  const shift = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);

  const renderMonth = (offset: number) => {
    const first = new Date(view.getFullYear(), view.getMonth() + offset, 1);
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let i = 1; i <= days; i++) cells.push(new Date(first.getFullYear(), first.getMonth(), i));
    const label = first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    return (
      <div className="cal-month" key={offset} role="grid" aria-label={label}>
        <div className="cal-month-title" aria-hidden="true">{label}</div>
        <div className="cal-dow" role="row">{DOW.map((d, i) => <span key={i} role="columnheader" aria-label={DOW_FULL[i]}>{d}</span>)}</div>
        <div className="cal-days">
          {cells.map((d, i) => {
            if (!d) return <span key={i} className="cal-empty" role="gridcell" />;
            const past = d < today;
            const start = sameDay(d, checkIn);
            const end = sameDay(d, checkOut);
            const rangeEnd = checkOut ?? (checkIn && hover && hover > checkIn ? hover : null);
            const inRange = !!checkIn && !!rangeEnd && d > checkIn && d < rangeEnd;
            const cls = ['cal-day', past && 'is-past', (start || end) && 'is-selected', inRange && 'in-range', start && rangeEnd && 'cap-start', end && 'cap-end'].filter(Boolean).join(' ');
            return (
              <button
                key={i}
                className={cls}
                disabled={past}
                onClick={() => pick(d)}
                onMouseEnter={() => setHover(d)}
                onMouseLeave={() => setHover(null)}
                aria-label={`${d.getDate()} ${label}${start ? ', check-in' : ''}${end ? ', check-out' : ''}${past ? ', unavailable' : ''}`}
                aria-pressed={start || end}
              >
                <span>{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar">
      <button className="cal-nav prev" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month"><Icon name="chevL" size={14} /></button>
      <button className="cal-nav next" onClick={() => shift(1)} aria-label="Next month"><Icon name="chevR" size={14} /></button>
      <div className="cal-months">{Array.from({ length: months }, (_, i) => renderMonth(i))}</div>
    </div>
  );
}

export const defaultDates = () => {
  const t = startOfDay(new Date());
  const a = addDays(t, 14);
  return { a, b: addDays(a, 5) };
};
