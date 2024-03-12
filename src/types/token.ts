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
  dominance: number
  percentVolumeChange24h: number;
}

export const getTokenData = (data: any): Token => {
  const quote = data.quote["USD"] || {};

  return {
    slug: data.slug,
    name: data.name,
    symbol: data.symbol,
    rank: data.cmc_rank,
    totalSupply: data.total_supply,
    maxSupply: data.max_supply,
    circulatingSupply: data.circulating_supply,
    infiniteSupply: data.infinite_supply,
    price: quote.price,
    volume24h: quote.volume_24h,
    percentChange24h: quote.percent_change_24h,
    percentChange7d: quote.percent_change_7d,
    fdv: quote.fully_diluted_market_cap,
    tvl: quote.tvl,
    dominance: quote.market_cap_dominance,
    percentVolumeChange24h: quote.volume_change_24h
  }
};