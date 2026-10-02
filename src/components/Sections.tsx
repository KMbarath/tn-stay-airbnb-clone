import { useRef, useState } from 'react';
import { Icon } from './Icon';
import { listing } from '../data/listing';
import { photoForKind, photosByCategory, type SceneKind } from '../data/photos';
import { formatINR } from '../lib/format';

export function Overview() {
  return (
    <section className="overview">
      <h2 className="h2">{listing.subtitle}</h2>
      <p className="facts">{listing.facts.join(' · ')}</p>
    </section>
  );
}

export function GuestFavourite() {
  return (
    <div className="gf-card">
      <div className="gf-badge">
        <Laurel /><span className="gf-text">Guest<br />favourite</span><Laurel flip />
      </div>
      <p className="gf-desc">One of the most loved homes on Airbnb, according to guests</p>
      <div className="gf-stat"><strong>{listing.rating}</strong><Stars /></div>
      <div className="gf-sep" />
      <div className="gf-stat"><strong>{listing.reviewCount}</strong><span className="gf-small">Reviews</span></div>
    </div>
  );
}

function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg className="laurel" width="26" height="40" viewBox="0 0 26 40" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path d="M20 38C9 34 4 24 6 12 M6 12c-2-3-2-6 0-9 3 2 4 5 3 9z M4 20c-3-1-4-4-3-7 3 0 5 2 5 5z M5 28c-3 0-5-2-5-5 3-1 5 1 6 4z M10 34c-3 1-6 0-7-3 3-2 6-1 8 2z" />
    </svg>
  );
}

function Stars() {
  return <span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={9} fill />)}</span>;
}

const reviewAvatars: Record<string, string> = {
  Priya: '/photos/review-priya.jpg',
  Arun: '/photos/review-arun.jpg',
  Divya: '/photos/review-divya.jpg',
  Rajesh: '/photos/review-rajesh.jpg',
  Lakshmi: '/photos/review-lakshmi.jpg',
  Vignesh: '/photos/review-vignesh.jpg',
};

export function DiscountBanner({ onClaim }: { onClaim: () => void }) {
  return (
    <div className="promo">
      <span className="promo-ic"><Icon name="tag" size={26} fill style={{ color: '#3d8f5b' }} /></span>
      <div className="promo-text">Get 10% off your next stay.<br /><u>Terms apply</u></div>
      <button className="claim" onClick={onClaim}>Claim</button>
    </div>
  );
}

export function HostSummary() {
  return (
    <div className="host-sum">
      <img className="avatar host-photo" src="/photos/host-barath.jpg" alt="Barath K M" />
      <div><div className="host-name">Hosted by {listing.host.name}</div><div className="muted-sm">Superhost · {listing.host.since}</div></div>
    </div>
  );
}

export function Highlights() {
  return (
    <ul className="highlights">
      {listing.highlights.map((h) => (
        <li key={h.title}>
          <Icon name={h.icon} size={26} strokeWidth={1.500} />
          <div><div className="hl-title">{h.title}</div><div className="muted-sm">{h.text}</div></div>
        </li>
      ))}
    </ul>
  );
}

export function Description() {
  const [open, setOpen] = useState(false);
  const shown = open ? listing.description : listing.description.slice(0, 1);
  return (
    <section className="block" id="about">
      <div className="translated"><Icon name="globe" size={16} /> Some info has been automatically translated.<u>Show original</u></div>
      {shown.map((t, i) => <p key={i} className="body-p">{t}</p>)}
      {!open && <p className="clamp-fade" aria-hidden="true" />}
      <button className="more-btn" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Show less' : 'Show more'}<Icon name={open ? 'chevU' : 'chevR'} size={14} /></button>
    </section>
  );
}

export function Sleeping({ onOpen }: { onOpen: (cat: string) => void }) {
  return (
    <section className="block" id="sleeping">
      <h2 className="h3">Where you'll sleep</h2>
      <div className="sleep-grid">
        {listing.sleeping.map((s) => (
          <button className="sleep-card" key={s.room} onClick={() => onOpen(s.photoCategory)} aria-label={`${s.room}, ${s.bed}. View photos`}>
            <img src={photosByCategory(s.photoCategory)[1].src} alt="" />
            <div className="sleep-room">{s.room}</div>
            <div className="muted-sm">{s.bed}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Amenities({ onOpen }: { onOpen: () => void }) {
  const total = listing.amenities.groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <section className="block" id="amenities">
      <h2 className="h3">What this place offers</h2>
      <ul className="amen-grid">
        {listing.amenities.featured.map((a) => <li key={a.label}><Icon name={a.icon} size={24} strokeWidth={1.500} />{a.label}</li>)}
      </ul>
      <button className="outline-btn" onClick={onOpen}>Show all {total} amenities</button>
    </section>
  );
}

export function Reviews({ shown }: { shown: number }) {
  const [all, setAll] = useState(false);
  const list = all ? listing.reviews : listing.reviews.slice(0, shown);
  return (
    <section className="block reviews" id="reviews">
      <div className="rev-head">
        <Laurel /><div className="rev-score">{listing.rating}</div><Laurel flip />
      </div>
      <h2 className="rev-title">Guest favourite</h2>
      <p className="rev-sub">One of the most loved homes on Airbnb<br />based on ratings, reviews and reliability</p>
      <div className="rev-stats">
        <div className="rev-dist" aria-label="Overall rating">
          <div className="rev-label">Overall rating</div>
          {listing.distribution.map((d) => (
            <div className="bar-row" key={d.stars}><span>{d.stars}</span><span className="bar"><i style={{ width: `${d.pct}%` }} /></span></div>
          ))}
        </div>
        {listing.ratingBreakdown.map((r) => (
          <div className="rev-cat" key={r.label}>
            <div className="rev-label">{r.label}</div><strong>{r.value.toFixed(1)}</strong><Icon name={r.icon} size={26} strokeWidth={1.500} />
          </div>
        ))}
      </div>
      <h3 className="h3 rev-count"><Icon name="star" size={16} fill /> {listing.rating} · {listing.reviewCount} reviews</h3>
      <div className="rev-grid">
        {list.map((r) => (
          <article className="rev-card" key={r.name}>
            <div className="rev-user"><img className="avatar sm review-avatar" src={reviewAvatars[r.name] ?? '/photos/review-arun.jpg'} alt={`${r.name} profile`} /><div><div className="host-name">{r.name}</div><div className="muted-sm">{r.place}</div></div></div>
            <div className="rev-meta"><Stars /> · {r.when}</div>
            <p className="body-p tight">{r.text}</p>
          </article>
        ))}
      </div>
      {!all && listing.reviews.length > shown && <button className="outline-btn" onClick={() => setAll(true)}>Show all {listing.reviewCount} reviews</button>}
    </section>
  );
}

export function MapSection() {
  return (
    <section className="block" id="location">
      <h2 className="h3">Where you'll be</h2>
      <p className="body-p tight">{listing.location}</p>
      <div className="map" role="img" aria-label="Map showing the listing near Kodaikanal Lake, Tamil Nadu">
        <svg viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <rect width="1000" height="420" fill="#e8efe3" />
          <path d="M0 300 C150 250 260 340 400 300 S650 220 760 280 S920 330 1000 290 V420 H0Z" fill="#d6e5d0" />
          <path d="M360 190 L430 140 L520 150 L590 205 L560 275 L470 300 L395 265Z" fill="#a9cfe6" stroke="#8fbad3" strokeWidth="3" />
          <path d="M0 120 C200 160 300 90 500 110 S820 60 1000 90" stroke="#fff" strokeWidth="14" fill="none" />
          <path d="M200 0 C230 120 330 200 420 420" stroke="#fff" strokeWidth="10" fill="none" />
          <path d="M700 0 C690 140 640 260 650 420" stroke="#fff" strokeWidth="8" fill="none" />
          <path d="M0 340 C300 350 600 330 1000 350" stroke="#fbe9b8" strokeWidth="9" fill="none" />
          <text x="448" y="225" fontSize="16" fill="#3a6f8f" fontStyle="italic">Kodai Lake</text>
          <text x="140" y="70" fontSize="14" fill="#6a7a66">Coaker's Walk</text>
          <text x="720" y="380" fontSize="14" fill="#6a7a66">Pillar Rocks</text>
        </svg>
        <div className="map-pin" aria-hidden="true"><span className="pin-pulse" /><span className="pin-dot"><Icon name="home" size={22} fill style={{ color: '#fff' }} /></span></div>
        <div className="map-zoom" aria-hidden="true"><span>+</span><span>-</span></div>
      </div>
      <p className="body-p tight">Exact location provided after booking.</p>
    </section>
  );
}

export function HostProfile() {
  return (
    <section className="block" id="host">
      <h2 className="h3">Meet your host</h2>
      <div className="host-wrap">
        <div className="host-card">
          <div className="host-card-main">
            <img className="avatar xl host-photo" src="/photos/host-barath.jpg" alt="Barath K M" />
            <div className="host-card-name">{listing.host.name}</div>
            <div className="superhost"><Icon name="medal" size={14} /> Superhost</div>
          </div>
          <div className="host-card-stats">
            <div><strong>{listing.reviewCount}</strong><span>Reviews</span></div><hr />
            <div><strong>{listing.rating}</strong><span>Rating</span></div><hr />
            <div><strong>6</strong><span>Years hosting</span></div>
          </div>
        </div>
        <div className="host-info">
          <h3 className="h4">Host details</h3>
          <p className="body-p tight">Response rate: 100%<br />Responds within an hour</p>
          <h3 className="h4">Co-hosts</h3>
          <ul className="cohosts">{listing.cohosts.map((c) => <li key={c}><span className="avatar sm" aria-hidden="true">{c[0]}</span>{c}</li>)}</ul>
          <button className="dark-btn wide">Message host</button>
          <p className="safe"><Icon name="shield" size={16} /> To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>
        </div>
      </div>
    </section>
  );
}

export function ThingsToKnow() {
  return (
    <section className="block" id="things">
      <h2 className="h3">Things to know</h2>
      <div className="ttk-grid">
        {Object.entries(listing.thingsToKnow).map(([t, items]) => (
          <div key={t}><h3 className="h4">{t}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul><button className="more-btn sm">Show more<Icon name="chevR" size={12} /></button></div>
        ))}
      </div>
    </section>
  );
}

export function Nearby() {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ l: false, r: true });
  const update = () => {
    const el = track.current; if (!el) return;
    setPos({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };
  const scroll = (d: number) => track.current?.scrollBy({ left: d * 600, behavior: 'smooth' });
  return (
    <section className="block nearby" id="nearby">
      <div className="nearby-head">
        <h2 className="h3">More stays in Tamil Nadu</h2>
        <div className="nearby-ctrl">
          <button className="round-btn sm" onClick={() => scroll(-1)} disabled={!pos.l} aria-label="Scroll left"><Icon name="chevL" size={14} /></button>
          <button className="round-btn sm" onClick={() => scroll(1)} disabled={!pos.r} aria-label="Scroll right"><Icon name="chevR" size={14} /></button>
        </div>
      </div>
      <div className="nearby-track" ref={track} onScroll={update}>
        {listing.nearby.map((n, i) => (
          <a className="stay" key={n.title} href="#top" onClick={(e) => e.preventDefault()}>
            <span className="stay-img"><img src={photoForKind(n.kind as SceneKind, i + 2)} alt={n.title} /><span className="stay-fav">Guest favourite</span></span>
            <span className="stay-t"><b>{n.title}</b><span><Icon name="star" size={11} fill /> {n.rating}</span></span>
            <span className="muted-sm">{n.sub}</span>
            <span className="stay-p"><b>{formatINR(n.price)}</b> night</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="foot-cols">
          <div><h4>Support</h4><a href="#top">Help Centre</a><a href="#top">AirCover</a><a href="#top">Cancellation options</a></div>
          <div><h4>Hosting</h4><a href="#top">Airbnb your home</a><a href="#top">Hosting resources</a><a href="#top">Community forum</a></div>
          <div><h4>Airbnb</h4><a href="#top">Newsroom</a><a href="#top">Careers</a><a href="#top">Investors</a></div>
        </div>
        <div className="foot-bar"><span>© 2026 Airbnb clone · Privacy · Terms · Sitemap</span><span>English (IND) · ₹ INR</span></div>
      </div>
    </footer>
  );
}
