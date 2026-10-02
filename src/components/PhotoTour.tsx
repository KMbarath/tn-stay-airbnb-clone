import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { categories, photosByCategory, photos } from '../data/photos';
import { useDialog } from '../lib/useDialog';

interface Props {
  saved: boolean;
  onClose: () => void;
  onOpenPhoto: (index: number) => void;
  onShare: () => void;
  onSave: () => void;
  initialCategory?: string;
}

export function PhotoTour({ saved, onClose, onOpenPhoto, onShare, onSave, initialCategory }: Props) {
  const ref = useDialog(onClose);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initialCategory ?? categories[0].id);

  const jump = (id: string) => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-cat="${id}"]`);
    const sc = scroller.current;
    if (el && sc) sc.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' });
    setActive(id);
  };

  useEffect(() => {
    if (initialCategory) {
      const el = scroller.current?.querySelector<HTMLElement>(`[data-cat="${initialCategory}"]`);
      if (el && scroller.current) scroller.current.scrollTop = el.offsetTop - 96;
    }
  }, [initialCategory]);

  // highlight the section currently in view
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const onScroll = () => {
      const marks = Array.from(sc.querySelectorAll<HTMLElement>('[data-cat]'));
      let cur = marks[0]?.dataset.cat ?? categories[0].id;
      for (const m of marks) if (m.offsetTop - 140 <= sc.scrollTop) cur = m.dataset.cat!;
      setActive(cur);
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    return () => sc.removeEventListener('scroll', onScroll);
  }, []);

  return createPortal(
    <div className="overlay tour" role="dialog" aria-modal="true" aria-label="Photo tour" ref={ref} tabIndex={-1}>
      <div className="tour-top">
        <button className="icon-btn plain" onClick={onClose} aria-label="Close photo tour"><Icon name="chevL" size={18} /></button>
        <h2 className="tour-title">Photo tour</h2>
        <div className="tour-actions">
          <button className="icon-btn plain" onClick={onShare} aria-label="Share"><Icon name="share" size={18} /></button>
          <button className="icon-btn plain" onClick={onSave} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={saved}>
            <Icon name="heart" size={18} fill={saved} style={saved ? { color: '#ff385c' } : undefined} />
          </button>
        </div>
      </div>

      <div className="tour-scroll" ref={scroller}>
        <div className="tour-inner">
          <nav className="tour-thumbs" aria-label="Photo categories">
            {categories.map((c) => {
              const first = photosByCategory(c.id)[0];
              return (
                <button key={c.id} className={`tour-thumb${active === c.id ? ' is-active' : ''}`} onClick={() => jump(c.id)} aria-current={active === c.id}>
                  <span className="tour-thumb-img"><img src={first.src} alt="" /></span>
                  <span className="tour-thumb-label">{c.title}</span>
                </button>
              );
            })}
          </nav>

          {categories.map((c) => {
            const list = photosByCategory(c.id);
            return (
              <section key={c.id} className="tour-section" data-cat={c.id} aria-labelledby={`t-${c.id}`}>
                <div className="tour-meta">
                  <h3 id={`t-${c.id}`}>{c.title}</h3>
                  <p>{c.details}</p>
                </div>
                <div className="tour-grid">
                  {list.map((p, i) => (
                    <button key={p.index} className={`tour-photo${i % 3 === 0 ? ' wide' : ''}`} onClick={() => onOpenPhoto(p.index)} aria-label={`Open ${p.alt}`}>
                      <img src={p.src} alt={p.alt} loading="lazy" />
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
          <p className="tour-end">{photos.length} photos</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
