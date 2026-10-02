import { Icon } from './Icon';
import { heroPhotos } from '../data/photos';

interface Props {
  title: string;
  saved: boolean;
  onShare: () => void;
  onSave: () => void;
  onOpenTour: () => void;
}

export function HeroGallery({ title, saved, onShare, onSave, onOpenTour }: Props) {
  return (
    <section id="top" aria-label="Photos" className="hero-section">
      <div className="title-row">
        <h1 className="listing-title">{title}</h1>
        <div className="title-actions">
          <button className="text-btn" onClick={onShare}><Icon name="share" size={16} /><span>Share</span></button>
          <button className="text-btn" onClick={onSave} aria-pressed={saved}>
            <Icon name="heart" size={16} fill={saved} style={saved ? { color: '#ff385c' } : undefined} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
      <div className="hero-grid">
        {heroPhotos.map((p, i) => (
          <button key={i} className={`hero-cell cell-${i}`} onClick={onOpenTour} aria-label={`View photo tour, ${p.alt}`}>
            <img src={p.src} alt={p.alt} />
            <span className="hero-veil" />
          </button>
        ))}
        <button className="show-all" onClick={onOpenTour}><Icon name="grid" size={14} />Show all photos</button>
      </div>
    </section>
  );
}
