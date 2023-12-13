const WebSocket = require('ws');
function broadcastMessage(session, message, sender) {
	[session.host, session.secondPlayer].forEach((client) => {
		// Отправляем сообщение каждому клиенту, кроме отправителя
		if (client && client.ws !== sender && client.ws.readyState === WebSocket.OPEN) {
			client.ws.send(message);
		}
	});
}

module.exports = { broadcastMessage };
