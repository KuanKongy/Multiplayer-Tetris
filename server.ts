//Start Server
import { WebSocketServer } from "ws";

const port = 1234;
const wss = new WebSocketServer({port});

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(`Message from clients: ${data}`);
    })

    ws.send(`Hellos`);
})

console.log(`Listening at ${port}...`);