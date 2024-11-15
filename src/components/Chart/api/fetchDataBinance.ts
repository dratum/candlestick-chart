import { MarketData } from "../Chart";

const endTime = Date.now();
const limit = 24;

export async function fetchDataBinance(
  symbol: string,
  interval: string
): Promise<MarketData[] | undefined> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&endTime=${endTime}&limit=${limit}`;
  try {
    const response = await fetch(url);
    const data: MarketData[] = await response.json();
    return data;
  } catch (error) {
    console.log({ Error: error });
  }
}
