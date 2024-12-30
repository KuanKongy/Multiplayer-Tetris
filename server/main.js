const express = require("express");
const socket = require("socket.io");

const Session = require("./session");
const Client = require("./client");

// const {
//   getHighscoreList,
//   updateHighscoreList
// } = require("./firebase/firebase"); //firebase got blocked by google cloud security system; on maintenance

const CLIENT_LIMIT = 2; //change this to increase max players
const port = process.env.PORT || 3000;
const sessions = new Map();

const app = express();
const server = app.listen(port, () =>
  console.log("Listening to requests on port: " + port)
);

const io = socket(server, { cors: { origin: '*' } });

io.on("connect", socket => {
  console.log("Connected to socket: ", socket.id);
  const client = createClient(socket);

  // getHighscoreList().then(data => {
  //   client.send({
  //     type: "highscore-list",
  //     list: data
  //   });
  // });
  
  socket.on("message", msg => {
    const data = JSON.parse(msg);

    switch (data.type) {
      case "create-session": {
        const session = createSession();
        session.join(client);
        client.send({
          type: "session-created",
          id: session.id
        });
        break;
      }
      case "join-session": {
        const session = getSession(data.id) || createSession(data.id);
        if (session.clients.size === CLIENT_LIMIT) {
          const sessionNew = createSession();
          sessionNew.join(client);
          client.send({
            type: "session-created",
            id: sessionNew.id
          });
          break;
        }
        session.join(client);
        broadcastSession(session);
        break;
      }
      case "state-update":
        client.broadcast(data);
        break;
      case "state-broadcast":
        client.broadcast(data);
        break;
      case "update-highscore":
        //updateHighscoreList(data.list);
        const package = {
          type: "highscore-list",
          list: data.list
        };
        client.send(package);
        client.broadcast(package);
        break;
    }
  });

  socket.on("disconnect", () => {
    console.log("Connection closed");
    const session = client.session;
    if (session) {
      session.leave(client);
      if (session.clients.size === 0) {
        sessions.delete(session.id);
      }
    }
    broadcastSession(session);
  });
});

function createId(len = 6, chars = "abcdefghjkmnopqrstwxyz0123456789") {
  let id = "";
  while (len--) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function createClient(conn, id = createId()) {
  return new Client(conn, id);
}

function createSession(id = createId()) {
  if (sessions.has(id)) {
    throw new Error(`Session ${id} already exists`);
  }

  const session = new Session(id);
  console.log("Creating session ", session);

  sessions.set(id, session);
  return session;
}

function getSession(id) {
  return sessions.get(id);
}

function broadcastSession(session) {
  if (!session) return;

  const clients = [...session.clients];
  clients.forEach(client => {
    client.send({
      type: "session-broadcast",
      peers: {
        you: client.id,
        clients: clients.map(client => client.id)
      }
    });
  });
}
