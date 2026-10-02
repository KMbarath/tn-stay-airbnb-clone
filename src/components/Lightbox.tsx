import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { photos } from '../data/photos';
import { useDialog } from '../lib/useDialog';

interface Props {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onOpenTour: () => void;
}

export function Lightbox({ index, onIndex, onClose, onOpenTour }: Props) {
  const ref = useDialog(onClose);
  const [dir, setDir] = useState<'next' | 'prev' | 'none'>('none');
  const total = photos.length;
  const photo = photos[index];

  const go = useCallback((d: 1 | -1) => {
    const n = index + d;
    if (n < 0 || n >= total) return;
    setDir(d === 1 ? 'next' : 'prev');
    onIndex(n);
  }, [index, total, onIndex]);

  // arrow keys keep working even if focus has been lost
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);

  // warm the cache for neighbours
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => { if (photos[i]) { const im = new Image(); im.src = photos[i].src; } });
  }, [index]);

  return createPortal(
    <div className="overlay lightbox" role="dialog" aria-modal="true" aria-label={`${photo.categoryTitle}, photo ${index + 1} of ${total}`} ref={ref} tabIndex={-1}>
      <div className="lb-top">
        <button className="icon-btn plain" onClick={onOpenTour} aria-label="Back to photo tour"><Icon name="grid" size={18} /></button>
        <h2 className="lb-title">{photo.categoryTitle}</h2>
        <div className="lb-right">
          <span className="lb-count" aria-live="polite">{index + 1} of {total}</span>
          <button className="icon-btn plain" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
        </div>
      </div>
      <div className="lb-stage">
        <button className="round-btn lb-prev" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous photo"><Icon name="chevL" size={18} /></button>
        <img key={photo.index} className={`lb-img from-${dir}`} src={photo.src} alt={photo.alt} draggable={false} />
        <button className="round-btn lb-next" onClick={() => go(1)} disabled={index === total - 1} aria-label="Next photo"><Icon name="chevR" size={18} /></button>
      </div>
    </div>,
    document.body,
  );
}
