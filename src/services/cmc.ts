import { Token } from '../types/token';
import { Env } from './../types/env';

export default {
  getTokenData(data: any): Token {
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
  },

  async fetchSymbols(env: Env, symbols: string) {
    const response: any = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}`, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
        'content-type': 'application/json;charset=UTF-8',
      },
    })
    .then(response => response.json());

    const hasError = response.status.error_code;
    if (hasError) {
      throw new Error(response.status.error_message);
    }

    const { data }: any = response;
    const results: any = [];

    const tokens = Object.keys(data);
    tokens.forEach(token => {
      data[token].filter((it: any) => it.is_active == true).forEach((tokenData: any) => {
        results.push(this.getTokenData(tokenData));
      })
    })

    results.sort((a: any, b: any) => b.percentChange24h - a.percentChange24h);

    return results;
  }
}