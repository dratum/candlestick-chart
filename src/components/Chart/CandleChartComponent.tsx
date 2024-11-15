import {
  createChart,
  CandlestickData,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";
import { FC, useEffect, useRef, useState } from "react";
import { MarketData } from "./Chart";
import { webSocketConnect } from "./api/webSocketBinance";
import { useTheme } from "../../contexts/ThemeConfigProvider";

interface CandleChartProps {
  data: MarketData[];
  selectedPair: string;
}
export const CandleChart: FC<CandleChartProps> = ({ data, selectedPair }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: isDarkMode ? "#1f1f1f" : "#ffffff" },
        textColor: isDarkMode ? "#ffffff" : "#000000",
      },
      grid: {
        vertLines: { color: isDarkMode ? "#3a3a3a" : "#e0e0e0" },
        horzLines: { color: isDarkMode ? "#3a3a3a" : "#e0e0e0" },
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeriesRef.current = candleSeries;

    if (data) {
      const formattedData: CandlestickData[] = data.map((el) => ({
        time: (el[0] / 1000) as UTCTimestamp,
        open: parseFloat(el[1]),
        high: parseFloat(el[2]),
        low: parseFloat(el[3]),
        close: parseFloat(el[4]),
      }));
      setChartData(formattedData);
      candleSeries.setData(formattedData);
    }

    const handleResize = () => {
      chart.resize(chartContainerRef.current!.clientWidth, 400);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, isDarkMode]);

  useEffect(() => {
    if (!candleSeriesRef.current || chartData.length === 0) return;

    const disconnect = webSocketConnect(selectedPair, (price) => {
      const lastCandle = chartData[chartData.length - 1];

      if (!lastCandle) return;

      const newCandle: CandlestickData = {
        time: ((lastCandle.time as UTCTimestamp) + 60) as UTCTimestamp,
        open: lastCandle.close,
        high: Math.max(lastCandle.close, parseFloat(price)),
        low: Math.min(lastCandle.close, parseFloat(price)),
        close: parseFloat(price),
      };

      setChartData((prevData) => {
        const updatedData = [...prevData, newCandle];
        candleSeriesRef.current!.setData(updatedData);
        return updatedData;
      });
    });

    return () => disconnect();
  }, [selectedPair, chartData]);

  return (
    <div ref={chartContainerRef} style={{ width: "80%", height: "50%" }} />
  );
};
