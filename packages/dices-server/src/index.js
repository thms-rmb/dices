const path = require("path");
const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const { DiceRoll } = require("rpg-dice-roller/lib/umd/bundle");
const clientPath = require.resolve("dices-client/dist/index.html");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    ws.on("message", message => {
        let payload;
        try {
            payload = JSON.parse(message);
        } catch (error) {
            ws.send(JSON.stringify({
                success: false,
                message: `Could not parse payload.`
            }));

            return;
        }

        const { user, spec } = payload;
        const { notation, total, rolls } = new DiceRoll(spec);
        const response = {
            success: true,
            user,
            notation,
            total,
            rolls: rolls[0].rolls.map(r => r.value)
        }

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(response));
            }
        });
    });
});

app.use(express.static(
    path.resolve(clientPath, "..")));

app.get("*", (req, res) => {
    res.sendFile(clientPath);
});

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port}`);
});
