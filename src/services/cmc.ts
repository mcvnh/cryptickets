import { Token } from '../types/token';
import { Env } from './../types/env';

const pullTokenData = (data: any): Token => {
	return {
		name: data.name,
		symbol: data.symbol,
		rank: data.cmc_rank,
		totalSupply: data.total_supply,
		maxSupply: data.max_supply,
		circulatingSupply: data.circulating_supply,
		infiniteSupply: data.infinite_supply,
		price: data.quote["USD"]?.price,
		volume24h: data.quote["USD"].volume_24h,
		percentChange24h: data.quote["USD"].percent_change_24h,
		percentChange7d: data.quote["USD"].percent_change_7d,
		fdv: data.quote["USD"].fully_diluted_market_cap,
		tvl: data.quote["USD"].tvl,

		dominance: data.quote["USD"].market_cap_dominance,
		percentVolumeChange24h: data.quote["USD"].volume_change_24h
	}
}

export default {
  async fetchSymbols(env: Env, symbols: string) {
    try {
      const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}`, {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
          'content-type': 'application/json;charset=UTF-8',
        },
      })
      .then(response => response.json());

      const { data }: any = response;
      const results: any = [];

      const tokens = Object.keys(data);
      tokens.forEach(token => {
        data[token].filter((it: any) => it.is_active == true).forEach((tokenData: any) => {
          results.push(pullTokenData(tokenData));
        })
      })

      results.sort((a: any, b: any) => b.percentChange24h - a.percentChange24h);

      return results;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}