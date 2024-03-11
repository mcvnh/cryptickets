import { describe, it, expect, vi } from 'vitest';
import mockQuotesSuccessLatest from './_mock/quotes_latest.success.json';
import mockQuotesErrorLatest from './_mock/quotes_latest.error.json';
import CMC from './cmc';

global.fetch = vi.fn();

const createFakeResponse = (fakeResponse) => {
  return { json: () => new Promise((resolve) => resolve(fakeResponse)) }
}

describe('Coinmarketcap service', () => {
  it('can get data from coinmarketcap', async () => {

    fetch.mockResolvedValue(createFakeResponse(mockQuotesSuccessLatest));
    const response = await CMC.fetchSymbols({ CMC_API_KEY: '123456' }, "btc");

    expect(fetch).toHaveBeenCalledWith(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=btc',
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': '123456',
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    )

    expect(response.length).toEqual(1)
  });

  it('can get the error response', async () => {
    fetch.mockResolvedValue(createFakeResponse(mockQuotesErrorLatest));
    const future = CMC.fetchSymbols({ CMC_API_KEY: '123456' }, "btc");
    await expect(async () => await future).rejects.toThrowError('Invalid value for "id"');

    expect(fetch).toHaveBeenCalledWith(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=btc',
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': '123456',
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    )
  })
});