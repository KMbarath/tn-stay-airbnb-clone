import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { Calendar } from './Calendar';
import { listing } from '../data/listing';
import { fmtNumeric, formatINR, nightsBetween } from '../lib/format';

export interface Guests { adults: number; children: number; infants: number; pets: number }

interface Props {
  checkIn: Date | null;
  checkOut: Date | null;
  onDates: (a: Date | null, b: Date | null) => void;
  guests: Guests;
  onGuests: (g: Guests) => void;
  onReserve: () => void;
}

export function BookingCard({ checkIn, checkOut, onDates, guests, onGuests, onReserve }: Props) {
  const [open, setOpen] = useState<'none' | 'dates' | 'guests'>('none');
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen('none'); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen('none'); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const base = nights * listing.nightly;
  const clean = nights ? listing.cleaningFee : 0;
  const service = Math.round((base + clean) * listing.serviceFeeRate);
  const tax = Math.round((base + clean + service) * listing.taxRate);
  const total = base + clean + service + tax;
  const count = guests.adults + guests.children;

  const set = (k: keyof Guests, d: number) => {
    const next = { ...guests, [k]: Math.max(k === 'adults' ? 1 : 0, guests[k] + d) };
    if (next.adults + next.children > listing.maxGuests) return;
    if (next.infants > 5 || next.pets > 0) return;
    onGuests(next);
  };

  const rows: { k: keyof Guests; label: string; sub: string; max?: number }[] = [
    { k: 'adults', label: 'Adults', sub: 'Age 13+' },
    { k: 'children', label: 'Children', sub: 'Ages 2 to 12' },
    { k: 'infants', label: 'Infants', sub: 'Under 2' },
    { k: 'pets', label: 'Pets', sub: 'Not allowed at this stay' },
  ];

  return (
    <aside className="booking" aria-label="Reservation" ref={box}>
      <div className="booking-card">
        <div className="price-line">
          {nights ? (
            <><span className="price-big"><u>{formatINR(base + clean)}</u></span><span className="price-sub">for {nights} night{nights > 1 ? 's' : ''}</span></>
          ) : (
            <span className="price-sub strong">Add dates for prices</span>
          )}
        </div>

        <div className="picker">
          <div className="picker-grid">
            <button className={`pk pk-in${open === 'dates' ? ' on' : ''}`} onClick={() => setOpen(open === 'dates' ? 'none' : 'dates')} aria-expanded={open === 'dates'} aria-haspopup="dialog">
              <span className="pk-label">CHECK-IN</span><span className="pk-val">{checkIn ? fmtNumeric(checkIn) : 'Add date'}</span>
            </button>
            <button className={`pk pk-out${open === 'dates' ? ' on' : ''}`} onClick={() => setOpen(open === 'dates' ? 'none' : 'dates')} aria-expanded={open === 'dates'}>
              <span className="pk-label">CHECKOUT</span><span className="pk-val">{checkOut ? fmtNumeric(checkOut) : 'Add date'}</span>
            </button>
            <button className={`pk pk-g${open === 'guests' ? ' on' : ''}`} onClick={() => setOpen(open === 'guests' ? 'none' : 'guests')} aria-expanded={open === 'guests'} aria-haspopup="dialog">
              <span className="pk-label">GUESTS</span>
              <span className="pk-val">{count} guest{count > 1 ? 's' : ''}{guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}</span>
              <Icon name={open === 'guests' ? 'chevU' : 'chevD'} size={16} className="pk-chev" />
            </button>
          </div>

          {open === 'dates' && (
            <div className="pop pop-dates" role="dialog" aria-label="Choose dates">
              <Calendar checkIn={checkIn} checkOut={checkOut} onChange={onDates} />
              <div className="pop-foot">
                <button className="link-btn" onClick={() => onDates(null, null)}>Clear dates</button>
                <button className="dark-btn" onClick={() => setOpen('none')}>Close</button>
              </div>
            </div>
          )}
          {open === 'guests' && (
            <div className="pop pop-guests" role="dialog" aria-label="Choose guests">
              {rows.map((r) => (
                <div className="g-row" key={r.k}>
                  <div><div className="g-title">{r.label}</div><div className="g-sub">{r.sub}</div></div>
                  <div className="stepper">
                    <button className="step" onClick={() => set(r.k, -1)} disabled={guests[r.k] <= (r.k === 'adults' ? 1 : 0)} aria-label={`Decrease ${r.label}`}><Icon name="minus" size={14} /></button>
                    <span className="step-n" aria-live="polite">{guests[r.k]}</span>
                    <button className="step" onClick={() => set(r.k, 1)} disabled={r.k === 'pets' || (r.k !== 'infants' && count >= listing.maxGuests)} aria-label={`Increase ${r.label}`}><Icon name="plus" size={14} /></button>
                  </div>
                </div>
              ))}
              <p className="g-note">This place has a maximum of {listing.maxGuests} guests, not including infants.</p>
              <button className="link-btn right" onClick={() => setOpen('none')}>Close</button>
            </div>
          )}
        </div>

        <button className="reserve" onClick={onReserve}>{nights ? 'Reserve' : 'Check availability'}</button>

        {nights > 0 && (
          <>
            <p className="no-charge">You won't be charged yet</p>
            <dl className="breakdown">
              <div><dt><u>{formatINR(listing.nightly)} x {nights} nights</u></dt><dd>{formatINR(base)}</dd></div>
              <div><dt><u>Cleaning fee</u></dt><dd>{formatINR(clean)}</dd></div>
              <div><dt><u>Airbnb service fee</u></dt><dd>{formatINR(service)}</dd></div>
              <div><dt><u>Taxes (GST 12%)</u></dt><dd>{formatINR(tax)}</dd></div>
            </dl>
            <div className="total"><span>Total</span><span>{formatINR(total)}</span></div>
          </>
        )}
      </div>
      <button className="report"><Icon name="flag" size={14} /><u>Report this listing</u></button>
    </aside>
  );
}
