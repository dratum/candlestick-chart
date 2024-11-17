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
import timeToLocal from "./helpers/timeToLocal";
import getIntervalDuration from "./helpers/getIntervalDuration";

interface CandleChartProps {
  data: MarketData[];
  selectedPair: string;
  interval: string;
}
export const CandleChart: FC<CandleChartProps> = ({
  data,
  selectedPair,
  interval,
}) => {
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
        rightOffset: 50,
        barSpacing: 10,
        fixLeftEdge: true,
        borderColor: isDarkMode ? "#ffffff" : "#000000",
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeriesRef.current = candleSeries;

    if (data && data.length > 0) {
      const formattedData: CandlestickData[] = data.map((el) => ({
        time: timeToLocal(el[0] / 1000) as UTCTimestamp,
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

    const intervalDuration = getIntervalDuration(interval);

    const disconnect = webSocketConnect(selectedPair, (price) => {
      setChartData((prevData) => {
        const lastCandle = prevData[prevData.length - 1];
        const currentTime = timeToLocal(Math.floor(Date.now() / 1000));

        if (!lastCandle) return prevData;

        if (
          currentTime <
          (lastCandle.time as UTCTimestamp) + intervalDuration
        ) {
          const updatedCandle: CandlestickData = {
            ...lastCandle,
            high: Math.max(lastCandle.high, parseFloat(price)),
            low: Math.min(lastCandle.low, parseFloat(price)),
            close: parseFloat(price),
          };
          const updatedData = [...prevData.slice(0, -1), updatedCandle];
          candleSeriesRef.current!.setData(updatedData);
          return updatedData;
        } else {
          console.log("Creating new candle");
          const newCandle: CandlestickData = {
            time: ((lastCandle.time as UTCTimestamp) +
              intervalDuration) as UTCTimestamp,
            open: parseFloat(price),
            high: parseFloat(price),
            low: parseFloat(price),
            close: parseFloat(price),
          };
          const updatedData = [...prevData, newCandle];
          candleSeriesRef.current!.setData(updatedData);
          return updatedData;
        }
      });
    });

    return () => disconnect();
  }, [selectedPair, chartData, interval]);

  return (
    <div ref={chartContainerRef} style={{ width: "80%", height: "50%" }} />
  );
};
