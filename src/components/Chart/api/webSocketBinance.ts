export function webSocketConnect(
  selectedPair: string,
  setPriceData: (price: string) => void
): () => void {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@ticker`
  );

  ws.onmessage = (event: MessageEvent) => {
    const data: { c: string } = JSON.parse(event.data);
    setPriceData(data.c.slice(0, data.c.indexOf(".") + 3));
  };

  const pongInterval = setInterval(() => {
    ws.send(JSON.stringify({ pong: true }));
  }, 180000);
  clearInterval(pongInterval);

  return () => {
    clearInterval(pongInterval);
    ws.close();
  };
}
