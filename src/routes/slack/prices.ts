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
import CMC from '../../services/cmc';
import SLACK from '../../services/slack';
import IGNORES from '../../services/ignores';

interface Column {
  key: string;
  label: string;
  formatter: Formatter;
}

const exportColumns: Column[] = [
  { key: "symbol", label: "Symbol", formatter: StringFormat },
  { key: "rank", label: "Rank", formatter: NumberFormat },
  { key: "slug", label: "Slug", formatter: StringFormat },
  { key: "percentChange24h", label: "% 24h", formatter: PercentFormat({ withEmoji: true }) },
  { key: "percentVolumeChange24h", label: "% Vol 24h", formatter: PercentFormat({ withEmoji: true, upIcon: '🚀', downIcon: '🆘' }) },
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

    const table = [columnNames, ...tableData];

    if (tableData.length === 0) {
      throw new Error('No tokens found!')
    }

    if (tableData.length === 1) {
      const adjustedTable = table[0].map((_: any, colIndex: number) => table.map(row => row[colIndex]));
      return markdownTable(adjustedTable);
    }

    return markdownTable(table);
  }
});

export default async (request: Request, env: Env) => {
  const receivedMessage = await SLACK.getSlackMessage(env, request);
  const channel = receivedMessage.channelId;
  const symbols = receivedMessage.text.replaceAll(" ", ",");

  try {
    const tokens = await CMC.fetchSymbols(env, symbols);

    const highCapTokens = tokens.filter((token: Token) => token.fdv > 1_000_000);

    const ignores = (await IGNORES.get(env, channel)).map(it => it.slug);

    const filteredTokens = highCapTokens.filter((token: Token) => !ignores.includes(token.slug))

    await SLACK.sendMessage(env, channel, '```\n' + TokensTable(filteredTokens).render(exportColumns) + '```\n');
  } catch (error: any) {
    return new Response(`${error.message}`);
  }

  return new Response();
}