import { Formatter } from "./types/formatter";
import { Token } from "./types/token";

const toHumanReadable = (input: any) => {
  const number = parseFloat(input);
  if (isNaN(number)) return "None";

  const trillion = 1_000_000_000_000;
  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (number >= trillion) return Math.round(number / trillion) + 'T';
  if (number >= billion) return Math.round(number / billion) + 'B';
  if (number >= million) return Math.round(number / million) + 'M';

  return number.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

export const StringFormat: Formatter = { format: (input: any) => input };
export const NumberFormat: Formatter = { format: (input: any) => parseFloat(input).toLocaleString("en-US") }
export const CurrencyFormat: Formatter = { format: (input: any) =>  toHumanReadable(input)};
export const PercentFormat: ((withEmoji: boolean) => Formatter) = (withEmoji = false) => ({
  format: (input: any) => {
    const value = parseFloat(input);
    const percentString = `${value.toLocaleString("en-US")}%`;

    return withEmoji
      ? (value <= 0 ? '😢' : '😆' + ' ' + percentString)
      : percentString
  }
});

export const BooleanFormat: Formatter = { format:  (input: any) => !!input ? 'Yes' : 'No' }
export const SupplyFormat: Formatter = {
  format: (_: any, token: Token) => {
    const currentSupply = token.circulatingSupply;
    const maxSupply = token.maxSupply;
    return `${toHumanReadable(currentSupply)}/${token.infiniteSupply ? '∞' : toHumanReadable(maxSupply)}`;
  }
};