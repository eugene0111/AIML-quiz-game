
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import express from "express";
import { gameStore } from "./lib/gameStore";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // console.log("New client connected", socket.id);

    socket.on("join_game", (data: { name: string }) => {
        gameStore.addPlayer(socket.id, data.name);
        io.emit("state_update", gameStore.getState());
    });

    socket.on("join_team", (teamId: 'team1' | 'team2') => {
        gameStore.joinTeam(socket.id, teamId);
        // We might want to broadcast player list too
        io.emit("state_update", gameStore.getState());
    });

    socket.on("start_game", (data: { team1Name: string, team2Name: string }) => {
        gameStore.startGame(data.team1Name, data.team2Name);
        io.emit("state_update", gameStore.getState());
    });

    socket.on("question_asked", () => {
        gameStore.startAnswering(socket.id);
        io.emit("state_update", gameStore.getState());
    });

    socket.on("raise_hand", () => {
        const success = gameStore.raiseHand(socket.id);
        if (success) {
            io.emit("state_update", gameStore.getState());
            io.emit("hand_raised", { playerId: socket.id });
        }
    });

    socket.on("grade_answer", (score: 0 | 0.5 | 1) => {
        gameStore.gradeAnswer(socket.id, score);
        io.emit("state_update", gameStore.getState());
    });

    socket.on("disconnect", () => {
      gameStore.removePlayer(socket.id);
      io.emit("state_update", gameStore.getState());
    });
  });

  // Attach the game logic here later
  // import { setupGameSocket } from "./lib/socket";
  // setupGameSocket(io);

  server.all("*all", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server ready`);
  });
});
