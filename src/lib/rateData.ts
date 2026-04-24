export interface Market {
  id: string;
  name: string;
  region: string;       // geographic region code, e.g. "EU"
  targetGP: number;     // target profit margin %, e.g. 38.0
  minGP: number;        // floor margin — decline or negotiate below this
  agencyMU: number;     // agency booking markup %
  platformMU: number;   // content platform fee markup %
}

export interface RoleType {
  id: string;
  name: string;
  category: string;
  icon: 'camera' | 'writing' | 'social';
}

export interface MarketRoleConfig {
  marketId: string;
  roleId: string;
  overheadRate: number;  // combined overhead %: gear depreciation + travel costs + editing software
  avgRate: number;       // destination average base day rate for this content type
}

export const MARKETS: Market[] = [
  { id: 'europe',    name: 'Europe',               region: 'EU',   targetGP: 38, minGP: 33, agencyMU: 72, platformMU: 65 },
  { id: 'se-asia',   name: 'SE Asia',               region: 'APAC', targetGP: 34, minGP: 28, agencyMU: 65, platformMU: 58 },
  { id: 'n-america', name: 'N. America',             region: 'NA',   targetGP: 40, minGP: 35, agencyMU: 75, platformMU: 68 },
  { id: 'latam',     name: 'Latin America',          region: 'LATAM',targetGP: 33, minGP: 27, agencyMU: 62, platformMU: 55 },
  { id: 'japan',     name: 'Japan & Korea',          region: 'APAC', targetGP: 38, minGP: 32, agencyMU: 70, platformMU: 63 },
  { id: 'mea',       name: 'Middle East & Africa',   region: 'MENA', targetGP: 42, minGP: 36, agencyMU: 80, platformMU: 72 },
];

export const ROLES: RoleType[] = [
  { id: 'photography', name: 'Travel Photography', category: 'Photo',   icon: 'camera'  },
  { id: 'writing',     name: 'Travel Writing',      category: 'Writing', icon: 'writing' },
  { id: 'social',      name: 'Social / Reels',       category: 'Social',  icon: 'social'  },
];

// Overhead rates reflect gear depreciation, travel days, editing time, and software.
// avgRate is the destination average base day rate for that content type.
export const CONFIGS: MarketRoleConfig[] = [
  // Europe
  { marketId: 'europe',    roleId: 'photography', overheadRate: 42, avgRate: 450 },
  { marketId: 'europe',    roleId: 'writing',     overheadRate: 18, avgRate: 300 },
  { marketId: 'europe',    roleId: 'social',      overheadRate: 28, avgRate: 380 },
  // SE Asia
  { marketId: 'se-asia',   roleId: 'photography', overheadRate: 38, avgRate: 280 },
  { marketId: 'se-asia',   roleId: 'writing',     overheadRate: 15, avgRate: 180 },
  { marketId: 'se-asia',   roleId: 'social',      overheadRate: 25, avgRate: 240 },
  // N. America
  { marketId: 'n-america', roleId: 'photography', overheadRate: 45, avgRate: 550 },
  { marketId: 'n-america', roleId: 'writing',     overheadRate: 20, avgRate: 350 },
  { marketId: 'n-america', roleId: 'social',      overheadRate: 30, avgRate: 480 },
  // Latin America
  { marketId: 'latam',     roleId: 'photography', overheadRate: 35, avgRate: 220 },
  { marketId: 'latam',     roleId: 'writing',     overheadRate: 13, avgRate: 140 },
  { marketId: 'latam',     roleId: 'social',      overheadRate: 22, avgRate: 190 },
  // Japan & Korea
  { marketId: 'japan',     roleId: 'photography', overheadRate: 40, avgRate: 400 },
  { marketId: 'japan',     roleId: 'writing',     overheadRate: 17, avgRate: 250 },
  { marketId: 'japan',     roleId: 'social',      overheadRate: 27, avgRate: 320 },
  // Middle East & Africa
  { marketId: 'mea',       roleId: 'photography', overheadRate: 48, avgRate: 500 },
  { marketId: 'mea',       roleId: 'writing',     overheadRate: 22, avgRate: 280 },
  { marketId: 'mea',       roleId: 'social',      overheadRate: 32, avgRate: 420 },
];

export function getMarket(id: string): Market | undefined {
  return MARKETS.find(m => m.id === id);
}

export function getRole(id: string): RoleType | undefined {
  return ROLES.find(r => r.id === id);
}

export function getConfig(marketId: string, roleId: string): MarketRoleConfig | undefined {
  return CONFIGS.find(c => c.marketId === marketId && c.roleId === roleId);
}

export function getMarketConfigs(marketId: string): MarketRoleConfig[] {
  return CONFIGS.filter(c => c.marketId === marketId);
}
