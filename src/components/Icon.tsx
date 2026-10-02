import type { SVGProps } from 'react';

const P: Record<string, string> = {
  share: 'M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
  heart: 'M12 20.5s-8-5.2-8-11A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5c0 5.8-8 11-8 11z',
  grid: 'M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01',
  chevL: 'M15 5l-7 7 7 7',
  chevR: 'M9 5l7 7-7 7',
  chevD: 'M5 9l7 7 7-7',
  chevU: 'M5 15l7-7 7 7',
  close: 'M5 5l14 14M19 5L5 19',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.500 18.500 12 21c-2.500-2.500-3.500-5.500-3.500-9S9.500 5.500 12 3z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'M5 12.5l4.500 4.500L19 7.500',
  wifi: 'M2.500 9a14 14 0 0119 0M5.500 12.500a9.500 9.500 0 0113 0M8.500 16a5 5 0 017 0M12 19.500h.01',
  tv: 'M3 6h18v11H3zM8 21h8M12 17v4',
  kitchen: 'M6 3v8M9 3v8M6 7h3M7.500 11v10M16 3c-2 2-2.500 5-2.500 8h2.500v10',
  ac: 'M3 6h18v7H3zM6 17l1 3M12 17v3M18 17l-1 3M7 9.500h10',
  parking: 'M6 3h7a5 5 0 010 10H9v8M6 3v18',
  pool: 'M3 17c2 0 2 1.500 4.500 1.500S10 17 12 17s2.500 1.500 4.500 1.500S19 17 21 17M8 14V5a2 2 0 014 0M16 14V5a2 2 0 014 0M8 9h8',
  gym: 'M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12',
  mountain: 'M2 20l7-12 4 6 3-4 6 10z',
  door: 'M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17M4 21h16M14 12h.01',
  pin: 'M12 21s-7-6.500-7-12a7 7 0 0114 0c0 5.500-7 12-7 12zM12 11.500a2.500 2.500 0 100-5 2.500 2.500 0 000 5z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  star: 'M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z',
  sparkle: 'M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800zM19 17l.8 2.200L22 20l-2.200.8L19 23l-.8-2.200L16 20l2.200-.8z',
  key: 'M15.500 8a3.500 3.500 0 11-7 0 3.500 3.500 0 017 0zM12 11.500V21M12 16.500h3M12 20h2.500',
  chat: 'M4 5h16v11H9l-5 4z',
  tag: 'M3 12V4h8l10 10-8 8zM7.500 8h.01',
  bed: 'M3 19V6M3 15h18v4M21 15v-3a3 3 0 00-3-3h-8v6M6.500 11.500a1.500 1.500 0 100-3 1.500 1.500 0 000 3z',
  shield: 'M12 3l8 3v6c0 4.500-3.200 7.800-8 9-4.800-1.200-8-4.500-8-9V6z',
  medal: 'M8 3h8l-2 6h-4zM12 9a5 5 0 100 10 5 5 0 000-10z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  home: 'M4 11l8-7 8 7v9H4zM10 20v-6h4v6',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  minus: 'M5 12h14',
  plus: 'M5 12h14M12 5v14',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8h.01',
};

export type IconName = keyof typeof P;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name' | 'fill'> {
  name: string;
  size?: number;
  fill?: boolean;
}

export function Icon({ name, size = 16, fill = false, ...rest }: Props) {
  const d = P[name] ?? P.info;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={name === 'grid' ? 3.200 : 1.800}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

/** Simple original wordmark. Not the trademarked Airbnb logo artwork. */
export function Logo() {
  return (
    <span className="logo" aria-label="Airbnb home">
      <svg width="32" height="34" viewBox="0 0 32 34" fill="none" stroke="currentColor" strokeWidth="2.400" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 3c-1.600 0-2.700 1.100-3.600 3L5 21c-1.800 3.800.7 8 4.600 8 2.600 0 4.700-1.700 6.400-3.700 1.700 2 3.800 3.700 6.400 3.700 3.900 0 6.400-4.200 4.600-8L19.600 6C18.700 4.100 17.600 3 16 3z" />
        <circle cx="16" cy="19" r="3.600" />
      </svg>
      <span className="logo-text">airbnb</span>
    </span>
  );
}
