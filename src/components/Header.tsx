import { Icon, Logo } from './Icon';
const thumb = '/photos/exterior-luxury.jpg';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="logo-link" aria-label="Airbnb home"><Logo /></a>
        <button className="search-pill" aria-label="Start your search">
          <span className="pill-thumb"><img src={thumb} alt="" /></span>
          <span className="pill-seg strong">Anywhere</span>
          <span className="pill-div" />
          <span className="pill-seg strong">Anytime</span>
          <span className="pill-div" />
          <span className="pill-seg muted">Add guests</span>
          <span className="pill-go"><Icon name="search" size={14} strokeWidth={2.600} /></span>
        </button>
        <div className="header-right">
          <button className="host-link">Become a host</button>
          <button className="icon-btn filled" aria-label="Choose language and currency"><Icon name="globe" size={16} /></button>
          <button className="icon-btn filled" aria-label="Main menu"><Icon name="menu" size={16} /></button>
        </div>
      </div>
    </header>
  );
}
