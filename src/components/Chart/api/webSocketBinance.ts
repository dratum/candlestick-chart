export function webSocketConnect(
  selectedPair: string,
  setPriceData: (price: string) => void
): () => void {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@ticker`
  );
  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    if (message.ping) {
      console.log("Ping received:", message.ping);
      ws.send(JSON.stringify({ pong: message.ping }));
      console.log("Pong sent in response to ping");
    } else if (message.c) {
      const price = message.c.slice(0, message.c.indexOf(".") + 3);
      setPriceData(price);
    }
  };

  const emptyPongInterval = setInterval(() => {
    ws.send(JSON.stringify({ pong: true }));
    webSocketConnect(selectedPair, setPriceData);
  }, 180000);
  ws.onclose = () => {
    clearInterval(emptyPongInterval);
  };
  return () => {
    clearInterval(emptyPongInterval);
    ws.close();
    console.log("WebSocket connection closed manually");
  };
}
