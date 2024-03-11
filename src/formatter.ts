import { Formatter } from "./types/formatter";
import { Token } from "./types/token";

const toHumanReadable = (input: any) => {
  const number = parseFloat(input);
  if (isNaN(number)) return "None";

  const trillion = 1_000_000_000_000;
  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (number > trillion) return Math.round(number / trillion) + 'T';
  if (number > billion) return Math.round(number / billion) + 'B';
  if (number > million) return Math.round(number / million) + 'M';

  return number.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

export const formatString: Formatter = { format: (input: any) => input };
export const formatNumber: Formatter = { format: (input: any) => parseFloat(input).toLocaleString("en-US") }
export const formatCurrency: Formatter = { format: (input: any) =>  toHumanReadable(input)};
export const formatPercent: Formatter = { format:  (input: any) => `${parseFloat(input) <= 0 ? '😢' : '😆'} ${parseFloat(input).toLocaleString("en-US")}%`}
export const formatPercentWoEmoji: Formatter = { format:  (input: any) => `${parseFloat(input).toLocaleString("en-US")}%`}
export const formatBoolean: Formatter = { format:  (input: any) => !!input ? 'Yes' : 'No' }
export const formatSupply: Formatter = {
  format: (_: any, token: Token) => {
    const currentSupply = token.circulatingSupply;
    const maxSupply = token.maxSupply;
    return `${toHumanReadable(currentSupply)}/${token.infiniteSupply ? '∞' : toHumanReadable(maxSupply)}`;
  }
};