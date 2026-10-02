/**
 * Procedural "photograph" generator.
 * Real photography cannot be bundled offline, so every listing photo is an
 * original, deterministic SVG illustration rendered as a data URI. Swap
 * `src` values in data/photos.ts for real images and nothing else changes.
 */
export type SceneKind =
  | 'living1' | 'living2' | 'kitchen' | 'bedroom' | 'bathroom'
  | 'gym' | 'exterior' | 'pool' | 'extra';

const PALETTE: Record<SceneKind, { wall: string; wall2: string; floor: string; accent: string; accent2: string }> = {
  living1: { wall: '#f4ead7', wall2: '#e9b949', floor: '#d9c4a0', accent: '#c9822b', accent2: '#8a3b22' },
  living2: { wall: '#7d8084', wall2: '#5f6367', floor: '#4a4c4f', accent: '#efe7d6', accent2: '#7a5a3a' },
  kitchen: { wall: '#f1e6cf', wall2: '#a8512a', floor: '#cdbb98', accent: '#2f3a35', accent2: '#c4793a' },
  bedroom: { wall: '#efe2cb', wall2: '#d6b98d', floor: '#7a3f25', accent: '#f7f2e9', accent2: '#a86f4a' },
  bathroom: { wall: '#b9b2a6', wall2: '#8f877b', floor: '#6f685f', accent: '#f4f1ea', accent2: '#4e4a44' },
  gym: { wall: '#e7e4dc', wall2: '#cfcac0', floor: '#4d4f52', accent: '#2c2e31', accent2: '#c0392b' },
  exterior: { wall: '#9ec9e2', wall2: '#f2f6f9', floor: '#7ba05b', accent: '#d9825b', accent2: '#e9b949' },
  pool: { wall: '#f1eee8', wall2: '#d7d2c7', floor: '#b79b72', accent: '#3aa7c9', accent2: '#1c7897' },
  extra: { wall: '#7d8084', wall2: '#5f6367', floor: '#a8763e', accent: '#efe7d6', accent2: '#2f7a46' },
};

/** small deterministic PRNG so every photo is stable between renders */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function plant(x: number, y: number, h: number, c: string) {
  let leaves = '';
  for (let i = -3; i <= 3; i++) {
    leaves += `<ellipse cx="${x + i * 14}" cy="${y - h + Math.abs(i) * 10}" rx="10" ry="${34 - Math.abs(i) * 3}" fill="${c}" transform="rotate(${i * 16} ${x} ${y - h / 2})"/>`;
  }
  return `<rect x="${x - 3}" y="${y - h}" width="6" height="${h}" fill="#4b3a2a"/>${leaves}<rect x="${x - 22}" y="${y - 6}" width="44" height="30" rx="6" fill="#5b4636"/>`;
}

function lamp(x: number, y: number) {
  return `<rect x="${x - 2}" y="${y}" width="4" height="70" fill="#3b3b3b"/><path d="M${x - 24} ${y} L${x + 24} ${y} L${x + 14} ${y - 36} L${x - 14} ${y - 36} Z" fill="#fff3c8"/>`;
}

export function sceneSvg(kind: SceneKind, seed: number): string {
  const p = PALETTE[kind];
  const r = rng(seed + kind.length * 7);
  const shift = Math.round(r() * 80) - 40;
  const zoom = 1 + r() * 0.18;
  const horizon = 330 + Math.round(r() * 40);
  let body = '';

  switch (kind) {
    case 'living1':
    case 'living2': {
      body += `<rect y="${horizon - 60}" width="800" height="70" fill="${p.wall2}" opacity="0.9"/>`;
      for (let i = 0; i < 4; i++) {
        body += `<circle cx="${140 + i * 170 + shift}" cy="${130 + r() * 30}" r="14" fill="#ffe9a8"/><circle cx="${140 + i * 170 + shift}" cy="${130}" r="30" fill="#ffe9a8" opacity="0.14"/>`;
      }
      body += `<rect x="${120 + shift}" y="${horizon - 10}" width="420" height="120" rx="22" fill="${p.accent}"/>`;
      body += `<rect x="${140 + shift}" y="${horizon - 70}" width="380" height="80" rx="20" fill="${p.accent}" opacity="0.92"/>`;
      body += `<rect x="${230 + shift}" y="${horizon + 130}" width="200" height="46" rx="10" fill="#fff"/>`;
      body += `<rect x="${560 + shift}" y="${horizon + 20}" width="120" height="14" fill="${p.accent2}"/><rect x="${575 + shift}" y="${horizon + 34}" width="8" height="90" fill="${p.accent2}"/><rect x="${655 + shift}" y="${horizon + 34}" width="8" height="90" fill="${p.accent2}"/>`;
      body += plant(70, horizon + 120, 200, '#3f7d46');
      body += plant(730, horizon + 110, 150, '#357040');
      break;
    }
    case 'extra': {
      // jacuzzi deck with wall lights and plants
      for (let i = 0; i < 4; i++) {
        body += `<path d="M${150 + i * 170 + shift} 120 l-16 40 h32z" fill="#2d2d2d"/><path d="M${150 + i * 170 + shift} 160 l-70 150 h140z" fill="#ffe9a8" opacity="0.2"/>`;
      }
      body += `<rect x="${60 + shift}" y="${horizon - 10}" width="${600 - shift}" height="230" rx="10" fill="#b0763c"/>`;
      body += `<rect x="${120 + shift}" y="${horizon + 20}" width="440" height="170" rx="26" fill="#f7f4ee" stroke="#d9d3c6" stroke-width="6"/>`;
      body += `<rect x="${150 + shift}" y="${horizon + 46}" width="380" height="118" rx="18" fill="#cfe7ef"/>`;
      for (let i = 0; i < 6; i++) body += `<circle cx="${190 + i * 62 + shift}" cy="${horizon + 105}" r="5" fill="#fff" opacity="0.8"/>`;
      body += plant(730, horizon + 130, 220, '#2f7a46') + plant(60, horizon + 100, 160, '#3a8a4f');
      break;
    }
    case 'kitchen': {
      body += `<rect x="40" y="170" width="720" height="14" fill="${p.accent}"/>`;
      body += `<rect x="40" y="184" width="720" height="190" fill="${p.accent2}"/>`;
      for (let i = 0; i < 8; i++) body += `<rect x="${52 + i * 90}" y="196" width="78" height="166" rx="4" fill="#b6642f" stroke="#7d3f1a" stroke-width="3"/>`;
      body += `<rect x="40" y="40" width="720" height="110" fill="#d79a55"/>`;
      for (let i = 0; i < 6; i++) body += `<rect x="${52 + i * 120}" y="52" width="108" height="86" rx="4" fill="#c4793a" stroke="#7d3f1a" stroke-width="3"/>`;
      body += `<rect x="330" y="380" width="170" height="130" rx="8" fill="#b3482b"/><circle cx="415" cy="400" r="26" fill="#fbe4a8"/>`;
      break;
    }
    case 'bedroom': {
      body += `<rect x="90" y="120" width="620" height="260" rx="14" fill="${p.wall2}" opacity="0.55"/>`;
      body += `<rect x="150" y="${horizon - 20}" width="500" height="150" rx="20" fill="${p.accent2}"/>`;
      body += `<rect x="130" y="${horizon + 40}" width="540" height="110" rx="26" fill="${p.accent}"/>`;
      body += `<ellipse cx="250" cy="${horizon + 20}" rx="70" ry="30" fill="#fff"/><ellipse cx="540" cy="${horizon + 20}" rx="70" ry="30" fill="#fff"/>`;
      body += `<rect x="560" y="60" width="150" height="190" rx="6" fill="#bfe2f0"/><path d="M560 60 L710 250 M710 60 L560 250" stroke="#ffffff" stroke-width="6"/>`;
      body += lamp(60, 200);
      break;
    }
    case 'bathroom': {
      body += `<ellipse cx="400" cy="230" rx="130" ry="170" fill="#e9e2d3" stroke="#6b5a3e" stroke-width="10"/><ellipse cx="400" cy="230" rx="112" ry="152" fill="#c9d6dd"/>`;
      body += `<rect x="150" y="${horizon + 20}" width="150" height="90" rx="40" fill="${p.accent}"/>`;
      body += `<rect x="520" y="${horizon - 40}" width="160" height="150" rx="14" fill="${p.accent}"/><circle cx="600" cy="${horizon + 30}" r="34" fill="#dcd6c9"/>`;
      body += `<rect x="40" y="120" width="40" height="260" fill="#dedbd2" opacity="0.35"/>`;
      break;
    }
    case 'gym': {
      body += `<rect x="100" y="${horizon - 120}" width="170" height="210" rx="12" fill="${p.accent}"/><rect x="130" y="${horizon - 160}" width="110" height="60" rx="10" fill="#555"/><circle cx="185" cy="${horizon + 130}" r="26" fill="${p.accent}"/>`;
      body += `<rect x="400" y="${horizon + 40}" width="250" height="26" fill="#333"/>`;
      for (let i = 0; i < 6; i++) body += `<rect x="${415 + i * 38}" y="${horizon + 6}" width="26" height="34" rx="5" fill="${i % 2 ? '#222' : p.accent2}"/>`;
      body += `<rect x="470" y="${horizon - 90}" width="140" height="80" fill="#cfe0e6" opacity="0.8"/>`;
      break;
    }
    case 'exterior': {
      body += `<rect y="0" width="800" height="${horizon}" fill="#a9d4ec"/>`;
      body += `<ellipse cx="620" cy="90" rx="90" ry="26" fill="#fff" opacity="0.85"/><ellipse cx="180" cy="130" rx="110" ry="28" fill="#fff" opacity="0.75"/>`;
      body += `<rect x="200" y="140" width="420" height="${horizon - 60}" fill="#f6efe2"/>`;
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 6; col++)
          body += `<rect x="${222 + col * 66}" y="${164 + row * 62}" width="34" height="40" fill="${(row + col) % 3 ? '#4a5a63' : p.accent2}"/>`;
      body += `<rect x="200" y="124" width="420" height="22" fill="${p.accent}"/>`;
      body += `<rect y="${horizon + 60}" width="800" height="200" fill="${p.floor}"/>`;
      for (let i = 0; i < 9; i++) body += `<circle cx="${40 + i * 90}" cy="${horizon + 70 + (i % 2) * 14}" r="${30 + (i % 3) * 8}" fill="#3d7a45"/>`;
      break;
    }
    case 'pool': {
      body += `<rect x="150" y="90" width="500" height="${horizon - 90}" fill="${p.wall2}"/>`;
      for (let i = 0; i < 5; i++) body += `<rect x="${150 + i * 100}" y="90" width="6" height="${horizon - 90}" fill="#fff" opacity="0.6"/>`;
      body += `<path d="M130 ${horizon + 20} L670 ${horizon + 20} L720 ${horizon + 200} L80 ${horizon + 200} Z" fill="${p.accent}"/>`;
      body += `<path d="M160 ${horizon + 60} Q 300 ${horizon + 40} 420 ${horizon + 70} T 650 ${horizon + 60}" stroke="#fff" stroke-width="4" fill="none" opacity="0.6"/>`;
      body += `<rect x="60" y="${horizon + 210}" width="680" height="40" fill="${p.floor}"/>`;
      break;
    }
  }

  const hue = Math.round(r() * 14) - 7;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.wall}"/><stop offset="1" stop-color="${p.wall2}" stop-opacity="0.55"/></linearGradient>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.floor}"/><stop offset="1" stop-color="${p.floor}" stop-opacity="0.78"/></linearGradient>
<radialGradient id="v" cx="0.5" cy="0.45" r="0.8"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/></radialGradient>
</defs>
<g transform="translate(${400 - 400 * zoom} ${300 - 300 * zoom}) scale(${zoom})" style="filter:hue-rotate(${hue}deg)">
<rect width="800" height="600" fill="url(#w)"/>
<rect y="${horizon + 40}" width="800" height="${560 - horizon}" fill="url(#f)"/>
${body}
</g>
<rect width="800" height="600" fill="url(#v)"/>
</svg>`;
}

export function sceneUri(kind: SceneKind, seed: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(sceneSvg(kind, seed))}`;
}
