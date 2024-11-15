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

  const pingInterval = setInterval(() => {
    ws.send(JSON.stringify({ pong: true }));
  }, 180000);

  const disconnect = () => {
    clearInterval(pingInterval);
    ws.close();
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed.");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    disconnect();
  };

  return disconnect;
}
