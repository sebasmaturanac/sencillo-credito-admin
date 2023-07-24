import { replace } from "lodash";
import numeral from "numeral";

export function fCurrency(number) {
  let parsedNumber = numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
  parsedNumber = parsedNumber.replace(/,/g, "-");
  parsedNumber = parsedNumber.replace(/\./g, ",");
  parsedNumber = parsedNumber.replace(/-/g, ".");
  return parsedNumber;
}

export function fPercent(number) {
  return numeral(number / 100).format("0.00%");
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format("0.00a"), ".00", "");
}

export function fData(number) {
  return numeral(number).format("0.0 b");
}
