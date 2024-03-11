import { Token } from '../../types/token';
import { Formatter } from '../../types/formatter';
import {
  CurrencyFormat,
  NumberFormat,
  PercentFormat,
  StringFormat,
  SupplyFormat
} from '../../formatter';
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
  { key: "rank", label: "Rank", formatter: NumberFormat },
  { key: "symbol", label: "Symbol", formatter: StringFormat },
  { key: "percentChange24h", label: "24h (%)", formatter: PercentFormat(true) },
  { key: "percentVolumeChange24h", label: "Vol 24h (%)", formatter: PercentFormat(false) },
  { key: "supply", label: "Supply", formatter: SupplyFormat },
  { key: "fdv", label: "FDV", formatter: CurrencyFormat },
  { key: "tvl", label: "TVL", formatter: CurrencyFormat },
  { key: "price", label: "Price", formatter: CurrencyFormat },
]

const TokensTable = (tokens: Token[]) => ({
  render: (columns: Column[]) => {
    const columnNames = columns.map((col: Column) => col.label);

    const tableData = tokens.map((token: any): any => {
      return columns.map((col: Column) => col.formatter.format(token[col.key], token));
    });

    return markdownTable([columnNames, ...tableData]);
  }
});

export default async (request: Request, env: Env) => {
  const body = await request.text();
  const params = qs.parse(body);
  const channel = (params['channel_id'] as string).trim();
  const symbols = (params['text'] as string).trim().replaceAll(" ", ",");

  try {
    const tokens = await CMC.fetchSymbols(env, symbols);
    await SLACK.sendMessage(env, channel, '```\n' + TokensTable(tokens).render(exportColumns) + '```\n');
  } catch (error: any) {
    return new Response(error.message);
  }

  return new Response();
}