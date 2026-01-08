import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState } from '../types';

let socket: Socket;

export const useSocket = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if not already connected
    if (!socket) {
      socket = io();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onStateUpdate(newState: GameState) {
      setGameState(newState);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state_update', onStateUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state_update', onStateUpdate);
    };
  }, []);

  const joinGame = (name: string) => {
    socket.emit('join_game', { name });
  };

  const joinTeam = (teamId: 'team1' | 'team2') => {
    socket.emit('join_team', teamId);
  };

  const startGame = (team1Name: string, team2Name: string) => {
    socket.emit('start_game', { team1Name, team2Name });
  };

  const askQuestion = () => {
    socket.emit('question_asked');
  };

  const raiseHand = () => {
    socket.emit('raise_hand');
  };

  const gradeAnswer = (score: 0 | 0.5 | 1) => {
    socket.emit('grade_answer', score);
  };

  return {
    socket,
    isConnected,
    gameState,
    joinGame,
    joinTeam,
    startGame,
    askQuestion,
    raiseHand,
    gradeAnswer
  };
};
