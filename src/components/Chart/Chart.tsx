import "./Chart.css";
import {
  ValueContext,
  ValuePairType,
} from "../../contexts/ValueConfigPairAndTimeframe";
import { CandleChart } from "./CandleChartComponent";
import { useContext, useEffect, useState } from "react";
import { fetchDataBinance } from "./api/fetchDataBinance";

import { useTheme } from "../../contexts/ThemeConfigProvider";

export type MarketData = [number, string, string, string, string];

const Chart = () => {
  const { isDarkMode } = useTheme();
  const { selectedPair, selectedTime } = useContext(
    ValueContext
  ) as ValuePairType;
  const [historicalMarketData, setHistoricalMarketData] = useState<
    MarketData[]
  >([]);

  useEffect(() => {
    let isMount = true;
    const getData = async () => {
      const data = await fetchDataBinance(selectedPair, selectedTime);
      if (data) {
        if (isMount) {
          setHistoricalMarketData(data);
        }
      }
    };
    getData();

    return () => {
      isMount = false;
    };
  }, [selectedPair, selectedTime, isDarkMode]);

  return (
    <div className='chart'>
      <CandleChart
        data={historicalMarketData}
        selectedPair={selectedPair}
        interval={selectedTime}
        isDarkMode={isDarkMode}
      ></CandleChart>
      <p>
        TradingView Lightweight Charts™ <br />
        Copyright (c) 2024 TradingView, Inc.{" "}
        <a href='https://www.tradingview.com/'>www.tradingview.com</a>
      </p>
    </div>
  );
};

export default Chart;
