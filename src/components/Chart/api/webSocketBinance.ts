export function webSocketConnect(
  selectedPair: string,
  setPriceData: (price: string) => void
): () => void {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@ticker`
  );
  ws.onopen = () => {
    console.log(`WebSocket connection opened for ${selectedPair}`);
  };
  ws.onmessage = (event: MessageEvent) => {
    const data: { c: string } = JSON.parse(event.data);
    setPriceData(data.c.slice(0, data.c.indexOf(".") + 3));
  };
  ws.onclose = () => {
    console.log(`WebSocket connection closed for ${selectedPair}`);
  };
  ws.onerror = (error) => {
    console.error(`WebSocket error for ${selectedPair}:`, error);
  };

  const pongInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ pong: true }));
    }
  }, 180000);

  return () => {
    console.log(`Closing WebSocket for ${selectedPair}`);
    clearInterval(pongInterval);
    ws.close();
  };
}
