import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { listing } from '../data/listing';
import { useDialog } from '../lib/useDialog';

export function AmenitiesModal({ onClose }: { onClose: () => void }) {
  const ref = useDialog(onClose);
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="amen-title" ref={ref} tabIndex={-1}>
        <div className="modal-head">
          <button className="icon-btn plain" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
        </div>
        <div className="modal-body">
          <h2 id="amen-title" className="modal-title">What this place offers</h2>
          {listing.amenities.groups.map((g) => (
            <section key={g.name} className="amen-group">
              <h3>{g.name}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it} className={g.name === 'Not included' ? 'struck' : ''}>
                    <Icon name={g.name === 'Not included' ? 'close' : 'check'} size={20} />{it}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
