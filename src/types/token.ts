export interface Token {
  slug: string;
  name: string;
  symbol: string;
  rank: number;
  totalSupply: number;
  maxSupply: number;
  circulatingSupply: number;
  infiniteSupply: boolean;
  price: number;
  volume24h: number;
  percentChange24h: number;
  percentChange7d: number;
  fdv: number;
  tvl: number;

  // new add
  dominance: number
  percentVolumeChange24h: number;
}
