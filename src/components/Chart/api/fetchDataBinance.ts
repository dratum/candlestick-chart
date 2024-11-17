import { MarketData } from "../Chart";

export async function fetchDataBinance(
  symbol: string,
  interval: string
): Promise<MarketData[] | undefined> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: MarketData[] = await response.json();
    if (data.length === 0) {
      console.log("No data returned from Binance API.");
      return undefined;
    }
    return data;
  } catch (error) {
    console.log({ "Error fetching data from Binance:": error });
  }
}
