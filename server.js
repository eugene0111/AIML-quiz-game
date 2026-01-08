import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import express from "express";
import { gameStore } from "./lib/gameStore.js";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("join_game", (data) => {
      gameStore.addPlayer(socket.id, data.name);
      io.emit("state_update", gameStore.getState());
    });

    socket.on("join_team", (teamId) => {
      gameStore.joinTeam(socket.id, teamId);
      io.emit("state_update", gameStore.getState());
    });

    socket.on("start_game", (data) => {
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

    socket.on("grade_answer", (score) => {
      gameStore.gradeAnswer(socket.id, score);
      io.emit("state_update", gameStore.getState());
    });

    socket.on("disconnect", () => {
      gameStore.removePlayer(socket.id);
      io.emit("state_update", gameStore.getState());
    });
  });

  // Let Next.js handle all HTTP routes
  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Server ready on port ${port}`);
    console.log(`> WebSocket server ready`);
  });
});
