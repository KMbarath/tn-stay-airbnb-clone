import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { HeroGallery } from './components/HeroGallery';
import { BookingCard, type Guests } from './components/BookingCard';
import { Calendar, defaultDates } from './components/Calendar';
import { PhotoTour } from './components/PhotoTour';
import { Lightbox } from './components/Lightbox';
import { AmenitiesModal } from './components/AmenitiesModal';
import { Toast } from './components/Toast';
import {
  Amenities, Description, DiscountBanner, Footer, GuestFavourite, Highlights, HostProfile,
  HostSummary, MapSection, Nearby, Overview, Reviews, Sleeping, ThingsToKnow,
} from './components/Sections';
import { listing } from './data/listing';
import { fmtShort, nightsBetween } from './lib/format';

const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

export function App() {
  const def = useRef(defaultDates()).current;
  const [checkIn, setCheckIn] = useState<Date | null>(def.a);
  const [checkOut, setCheckOut] = useState<Date | null>(def.b);
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [saved, setSaved] = useState<boolean>(() => store.get('tn-saved', false));
  const [toast, setToast] = useState<string | null>(null);
  const [tour, setTour] = useState<{ open: boolean; category?: string }>({ open: false });
  const [lb, setLb] = useState<number | null>(null);
  const [amenities, setAmenities] = useState(false);
  const [navShown, setNavShown] = useState(false);
  const [activeSection, setActiveSection] = useState('Photos');
  const heroRef = useRef<HTMLDivElement>(null);
  const clearToast = useCallback(() => setToast(null), []);

  useEffect(() => { store.set('tn-saved', saved); }, [saved]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const updateNav = () => {
      const rect = el.getBoundingClientRect();
      setNavShown(rect.bottom <= 0);
      if (rect.top >= -100) setActiveSection('Photos');
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    return () => {
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
    };
  }, []);

  useEffect(() => {
    const sections = [
      ['Photos', 'top'], ['Amenities', 'amenities'], ['Reviews', 'reviews'], ['Location', 'location'],
    ] as const;
    const updateActiveSection = () => {
      const marker = window.scrollY + 120;
      let current = 'Photos';
      sections.forEach(([label, id]) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= marker) current = label;
      });
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setToast('Link copied to clipboard'); }
    catch { setToast('Copy the link from the address bar'); }
  };
  const save = () => { setSaved((s) => { setToast(s ? 'Removed from wishlist' : 'Saved to Wishlist'); return !s; }); };
  const reserve = () => {
    if (!checkIn || !checkOut) { document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setToast('Reservation request sent. This is a demo, nothing was charged.');
  };
  const dates = (a: Date | null, b: Date | null) => { setCheckIn(a); setCheckOut(b); };
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const openTour = (category?: string) => setTour({ open: true, category });
  const openPhoto = (i: number) => setLb(i);

  return (
    <>
      <div id="app-root">
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <div className={`section-nav${navShown ? ' show' : ''}`} aria-hidden={!navShown}>
          <div className="section-nav-inner">
            <nav aria-label="Page sections">
              {[['Photos', '#top'], ['Amenities', '#amenities'], ['Reviews', '#reviews'], ['Location', '#location']].map(([l, h]) => (
                <a className={activeSection === l ? 'active' : ''} key={l} href={h} onClick={() => setActiveSection(l)} tabIndex={navShown ? 0 : -1}>{l}</a>
              ))}
            </nav>
            <div className="sn-right">
              <span className="sn-price">
                <b>{formatNav(nights ? totalForStay(nights) : listing.nightly)}</b>{' '}
                {nights ? `total for ${nights} night${nights > 1 ? 's' : ''}` : 'night'}
              </span>
              <button className="reserve sm" tabIndex={navShown ? 0 : -1} onClick={reserve}>Reserve</button>
            </div>
          </div>
        </div>

        <main id="main" className="page">
          <div ref={heroRef}>
            <HeroGallery title={listing.title} saved={saved} onShare={share} onSave={save} onOpenTour={() => openTour()} />
          </div>

          <div className="two-col">
            <div className="col-main">
              <Overview />
              <GuestFavourite />
              <HostSummary />
              <Highlights />
              <Description />
              <Sleeping onOpen={(c) => openTour(c)} />
              <Amenities onOpen={() => setAmenities(true)} />
              <section className="block" id="availability">
                <h2 className="h3">{nights ? `${nights} nights in Kodaikanal` : 'Select check-in date'}</h2>
                <p className="muted-sm cal-sub">{checkIn && checkOut ? `${fmtShort(checkIn)} - ${fmtShort(checkOut)}, ${checkOut.getFullYear()}` : 'Add your travel dates for exact pricing'}</p>
                <Calendar checkIn={checkIn} checkOut={checkOut} onChange={dates} />
                <div className="cal-foot"><button className="link-btn" onClick={() => dates(null, null)}>Clear dates</button></div>
              </section>
            </div>
            <div className="col-side">
              <DiscountBanner onClaim={() => setToast('Coupon claimed. It applies to your next stay.')} />
              <BookingCard checkIn={checkIn} checkOut={checkOut} onDates={dates} guests={guests} onGuests={setGuests} onReserve={reserve} />
            </div>
          </div>

          <Reviews shown={4} />
          <MapSection />
          <HostProfile />
          <ThingsToKnow />
          <Nearby />
        </main>
        <Footer />
      </div>

      {tour.open && (
        <PhotoTour
          saved={saved}
          initialCategory={tour.category}
          onClose={() => setTour({ open: false })}
          onOpenPhoto={openPhoto}
          onShare={share}
          onSave={save}
        />
      )}
      {lb !== null && (
        <Lightbox
          index={lb}
          onIndex={setLb}
          onClose={() => setLb(null)}
          onOpenTour={() => { setLb(null); setTour((t) => ({ open: true, category: t.category })); }}
        />
      )}
      {amenities && <AmenitiesModal onClose={() => setAmenities(false)} />}
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}

const formatNav = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const totalForStay = (nights: number) => {
  const base = nights * listing.nightly;
  const cleaning = listing.cleaningFee;
  const service = Math.round((base + cleaning) * listing.serviceFeeRate);
  const tax = Math.round((base + cleaning + service) * listing.taxRate);
  return base + cleaning + service + tax;
};
