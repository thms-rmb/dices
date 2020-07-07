const createSocket = (messageHandler, openHandler, errorHandler) => {
    let loc = window.location, protocol;
    protocol = loc.protocol === "https:" ? "wss:" : "ws:";

    const webSocket = new WebSocket(`${protocol}//${loc.host}`);
    webSocket.onmessage = messageHandler;
    webSocket.onopen = openHandler;
    webSocket.onerror = errorHandler;
}

export { createSocket }
