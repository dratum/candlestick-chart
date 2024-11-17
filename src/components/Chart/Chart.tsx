import { useContext, useEffect, useState } from "react";
import "./Chart.css";
import { fetchDataBinance } from "./api/fetchDataBinance";
import {
  ValueContext,
  ValuePairType,
} from "../../contexts/ValueConfigPairAndTimeframe";
import { CandleChart } from "./CandleChartComponent";

export type MarketData = [number, string, string, string, string];

const Chart = () => {
  const [historicalMarketData, setHistoricalMarketData] = useState<
    MarketData[]
  >([]);
  const { selectedPair, selectedTime } = useContext(
    ValueContext
  ) as ValuePairType;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDataBinance(selectedPair, selectedTime);
      setHistoricalMarketData(data as MarketData[]);
    };
    getData();
  }, [selectedPair, selectedTime]);

  return (
    <div className='chart'>
      <CandleChart
        data={historicalMarketData}
        selectedPair={selectedPair}
        interval={selectedTime}
      ></CandleChart>
      <p>
        TradingView Lightweight Charts™ <br />
        Copyright (c) 2024 TradingView, Inc. https://www.tradingview.com/
      </p>
    </div>
  );
};

export default Chart;
