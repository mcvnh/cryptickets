import { it, expect } from 'vitest';

import {
  BooleanFormat,
  CurrencyFormat,
  NumberFormat,
  PercentFormat,
  StringFormat,
  SupplyFormat
} from './formatter';


it("should returns correct string format", () => {
  expect(StringFormat.format("Hello World", null)).toBe("Hello World");
});

it("should returns correct number format", () => {
  expect(NumberFormat.format("123456", null)).toBe("123,456");
});

it("should returns correct currency format", () => {
  expect(CurrencyFormat.format("12345", null)).toBe("$12,345.00");
  expect(CurrencyFormat.format("1234567", null)).toBe("1M");
  expect(CurrencyFormat.format("12345678910", null)).toBe("12B");
  expect(CurrencyFormat.format("1234567891011", null)).toBe("1T");
});

it("should returns correct percent format", () => {
  expect(PercentFormat({ withEmoji: true }).format('12.30', null)).toBe('😆 12.3%');
  expect(PercentFormat({ withEmoji: true, downIcon: '🆘' }).format('-12.30', null)).toBe('🆘 -12.3%');
  expect(PercentFormat({ withEmoji: false }).format('12.30', null)).toBe('12.3%');
});

it("should returns correct percent format", () => {
  expect(BooleanFormat.format(true, null)).toBe('Yes');
  expect(BooleanFormat.format(false, null)).toBe('No');
});

it("should returns correct supply format", () => {
  expect(SupplyFormat.format(null, { circulatingSupply: 100, maxSupply: 1000 })).toBe('$100.00/$1,000.00');
})
