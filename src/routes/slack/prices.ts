import { Token } from '../../types/token';
import { Formatter } from '../../types/formatter';
import { formatString, formatBoolean, formatCurrency, formatPercent, formatPercentWoEmoji } from '../../formatter';
import { markdownTable } from 'markdown-table';
import { Env } from '../../types/env';
import qs from 'qs';
import CMC from '../../services/cmc';
import SLACK from '../../services/slack';

const tokenArrayToMarkdownTable = (data: Token[]) => {
	const keys = ["rank", "symbol", "percentChange24h", "percentVolumeChange24h", "infiniteSupply", "fdv", "tvl", "price"];
	const columnFormat: { [key: string]: Formatter } = {
    "rank": formatString,
		"symbol": formatString,
		"percentChange24h": formatPercent,
    "percentVolumeChange24h": formatPercentWoEmoji,
    "infiniteSupply": formatBoolean,
		"fdv": formatCurrency,
		"tvl": formatCurrency,
		"price": formatCurrency,
	}

	const format = (column: string, value: any) => {
		return columnFormat[column].format(value);
	}

	const readableColumnNames = ["Rank", "Symbol", "24h (%)", "Vol 24h (%)", "∞ supply", "FDV", "TVL", "Price"];
	const columns = [readableColumnNames, ...data.map((token: any): any => keys.map((column): any => format(column, token[column])))]

	return markdownTable(columns);
}

export default async (request: Request, env: Env) => {
  const body = await request.text();
  const params = qs.parse(body);
  const channel = (params['channel_id'] as string).trim();
  const symbols = (params['text'] as string).trim().replaceAll(" ", ",");

  const results = await CMC.fetchSymbols(env, symbols);
  const status = await SLACK.sendMessage(env, channel, '```\n' + tokenArrayToMarkdownTable(results) + '```\n');

  if (!status) {
    return new Response("Error, something went wrong, please check!");
  }

  return new Response();
}