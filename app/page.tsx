'use client';

import { useState } from 'react';
import GameSetup from './components/GameSetup';
import GameSession from './components/GameSession';
import { GameState } from './types';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    section: 'setup',
    teams: {
      team1: { id: 'team1', name: '', score: 0 },
      team2: { id: 'team2', name: '', score: 0 },
    },
    currentRound: 1,
    activeTeamId: 'team1',
    phase: 'asking',
  });

  const handleStartGame = (t1Name: string, t2Name: string) => {
    setGameState(prev => ({
      ...prev,
      section: 'playing',
      teams: {
        team1: { ...prev.teams.team1, name: t1Name },
        team2: { ...prev.teams.team2, name: t2Name },
      }
    }));
  };

  const handleUpdateState = (newState: GameState) => {
    setGameState(newState);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12">
      {gameState.section === 'setup' && (
        <GameSetup onStart={handleStartGame} />
      )}
      
      {gameState.section === 'playing' && (
        <GameSession 
          initialState={gameState} 
          onUpdateState={handleUpdateState} 
        />
      )}
    </main>
  );
}
