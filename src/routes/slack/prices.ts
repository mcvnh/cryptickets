import { Token } from '../../types/token';
import { Formatter } from '../../types/formatter';
import { formatString, formatBoolean, formatCurrency, formatPercent, formatPercentWoEmoji, formatNumber } from '../../formatter';
import { markdownTable } from 'markdown-table';
import { Env } from '../../types/env';
import qs from 'qs';
import CMC from '../../services/cmc';
import SLACK from '../../services/slack';

interface Column {
  key: string;
  label: string;
  formatter: Formatter;
}

const exportColumns: Column[] = [
  { key: "rank", label: "Rank", formatter: formatNumber },
  { key: "symbol", label: "Rank", formatter: formatString },
  { key: "percentChange24h", label: "Rank", formatter: formatPercent },
  { key: "percentVolumeChange24h", label: "Rank", formatter: formatPercentWoEmoji },
  { key: "infiniteSupply", label: "Rank", formatter: formatBoolean },
  { key: "fdv", label: "Rank", formatter: formatCurrency },
  { key: "tvl", label: "Rank", formatter: formatCurrency },
  { key: "price", label: "Rank", formatter: formatCurrency },
]

const TokensTable = (tokens: Token[]) => ({ 
  render: (columns: Column[]) => {
    const columnNames = columns.map((col: Column) => col.label);
    const tableData = tokens.map((token: any): any => columns.map((col: Column) => col.formatter.format(token[col.key])))

    return markdownTable([columnNames, ...tableData]);
  }
});

export default async (request: Request, env: Env) => {
  const body = await request.text();
  const params = qs.parse(body);
  const channel = (params['channel_id'] as string).trim();
  const symbols = (params['text'] as string).trim().replaceAll(" ", ",");

  const tokens = await CMC.fetchSymbols(env, symbols);
  const status = await SLACK.sendMessage(env, channel, '```\n' + TokensTable(tokens).render(exportColumns) + '```\n');

  if (!status) {
    return new Response("Error, something went wrong, please check!");
  }

  return new Response();
}