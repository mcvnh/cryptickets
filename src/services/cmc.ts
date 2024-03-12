import { getTokenData } from '../types/token';
import { Env } from './../types/env';

export default {
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
        results.push(getTokenData(tokenData));
      })
    })

    results.sort((a: any, b: any) => b.percentChange24h - a.percentChange24h);

    return results;
  }
}