export interface Sticker {
  id: string;
  name: string;
  svg: string;
}

export const STICKER_CATALOGUE: Record<string, Sticker> = {
  passport: {
    id: 'passport',
    name: 'Passport Stamp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="90" fill="none" stroke="#C0392B" stroke-width="8" stroke-dasharray="14 6"/>
      <circle cx="100" cy="100" r="74" fill="none" stroke="#C0392B" stroke-width="3"/>
      <text x="100" y="82" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="#C0392B" letter-spacing="3">PASSPORT</text>
      <line x1="35" y1="93" x2="165" y2="93" stroke="#C0392B" stroke-width="1.5"/>
      <text x="100" y="115" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#C0392B">ADMITTED</text>
      <line x1="35" y1="122" x2="165" y2="122" stroke="#C0392B" stroke-width="1.5"/>
      <text x="100" y="143" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#C0392B">2024</text>
    </svg>`,
  },
  compass: {
    id: 'compass',
    name: 'Compass Rose',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="88" fill="none" stroke="#2C3E50" stroke-width="2"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#2C3E50" stroke-width="1" opacity="0.4"/>
      <polygon points="100,18 108,96 100,86 92,96" fill="#C0392B"/>
      <polygon points="100,182 108,104 100,114 92,104" fill="#2C3E50"/>
      <polygon points="18,100 96,92 86,100 96,108" fill="#2C3E50"/>
      <polygon points="182,100 104,92 114,100 104,108" fill="#2C3E50"/>
      <circle cx="100" cy="100" r="9" fill="#2C3E50"/>
      <circle cx="100" cy="100" r="4" fill="white"/>
      <text x="100" y="12" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#C0392B">N</text>
      <text x="100" y="198" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#2C3E50">S</text>
      <text x="192" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#2C3E50">E</text>
      <text x="8" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#2C3E50">W</text>
    </svg>`,
  },
  luggage: {
    id: 'luggage',
    name: 'Luggage Tag',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180" width="120" height="180">
      <rect x="15" y="38" width="90" height="132" rx="8" fill="#F39C12" stroke="#E67E22" stroke-width="3"/>
      <rect x="44" y="12" width="32" height="30" rx="5" fill="none" stroke="#E67E22" stroke-width="3"/>
      <circle cx="60" cy="12" r="5" fill="none" stroke="#E67E22" stroke-width="3"/>
      <line x1="60" y1="38" x2="60" y2="17" stroke="#E67E22" stroke-width="3"/>
      <rect x="24" y="58" width="72" height="44" rx="5" fill="white" opacity="0.92"/>
      <text x="60" y="79" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#2C3E50">TRAVEL</text>
      <text x="60" y="96" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#2C3E50">JOURNAL</text>
      <line x1="24" y1="118" x2="96" y2="118" stroke="white" stroke-width="2" opacity="0.7"/>
      <line x1="24" y1="132" x2="96" y2="132" stroke="white" stroke-width="2" opacity="0.7"/>
      <line x1="24" y1="146" x2="80" y2="146" stroke="white" stroke-width="2" opacity="0.7"/>
    </svg>`,
  },
  pin: {
    id: 'pin',
    name: 'Location Pin',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" width="100" height="140">
      <path d="M50 8 C24 8 8 27 8 50 C8 78 50 132 50 132 C50 132 92 78 92 50 C92 27 76 8 50 8Z" fill="#E74C3C" stroke="#C0392B" stroke-width="3"/>
      <circle cx="50" cy="50" r="19" fill="white"/>
      <circle cx="50" cy="50" r="10" fill="#E74C3C"/>
    </svg>`,
  },
  stamp: {
    id: 'stamp',
    name: 'Vintage Stamp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220" width="180" height="220">
      <rect x="10" y="10" width="160" height="200" rx="4" fill="#F5F0E8" stroke="#8B6914" stroke-width="2"/>
      <rect x="22" y="22" width="136" height="176" rx="2" fill="none" stroke="#8B6914" stroke-width="1.5" stroke-dasharray="6 4"/>
      <rect x="30" y="30" width="120" height="100" rx="2" fill="#D4E8C2" stroke="#8B6914" stroke-width="1"/>
      <ellipse cx="90" cy="80" rx="40" ry="30" fill="none" stroke="#2D6A4F" stroke-width="2"/>
      <text x="90" y="86" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#2D6A4F">TRAVEL</text>
      <text x="90" y="148" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="bold" fill="#8B6914">MEMORIES</text>
      <text x="90" y="168" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="#8B6914">EST. 2024</text>
    </svg>`,
  },
};

export const STICKER_LIST = Object.values(STICKER_CATALOGUE);
