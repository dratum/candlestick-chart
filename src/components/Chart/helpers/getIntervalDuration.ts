const getIntervalDuration = (interval: string) => {
  const durations: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "30m": 1800,
    "1h": 3600,
    "4h": 14400,
    "1d": 86400,
  };
  return durations[interval] || 60;
};
export default getIntervalDuration;
