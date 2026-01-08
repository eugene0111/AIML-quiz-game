'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSocket } from './hooks/useSocket';
import Lobby from './components/Lobby';
import GameSession from './components/GameSession';
import { Loader2, LogIn } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const { gameState, isConnected, joinGame, joinTeam, startGame, askQuestion, raiseHand, gradeAnswer } = useSocket();
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (isConnected && session?.user?.name && !hasJoined) {
      joinGame(session.user.name);
      setHasJoined(true);
    }
  }, [isConnected, session, hasJoined, joinGame]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-panel p-10 rounded-2xl text-center max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quiz Battle
          </h1>
          <p className="text-gray-400 mb-8">
            Login with Google to join the game.
          </p>
          <button
            onClick={() => signIn('google')}
            className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  if (!gameState) {
     return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Connecting to game server...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        {/* Header with User Info */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-bold text-white">{session.user?.name}</p>
                <p className="text-xs text-green-400">Online</p>
            </div>
            {session.user?.image && (
                <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full border border-white/20" />
            )}
             <button onClick={() => signOut()} className="text-xs text-gray-500 hover:text-white transition-colors">
                Sign Out
            </button>
        </div>

      {gameState.section === 'setup' && (
        <Lobby 
            gameState={gameState} 
            onJoinTeam={joinTeam} 
            onStartGame={startGame}
            currentPlayerName={session.user?.name || ''}
        />
      )}
      
      {gameState.section === 'playing' && (
        <GameSession 
          initialState={gameState} 
          onRaiseHand={raiseHand}
          onGradeAnswer={gradeAnswer}
          onAskQuestion={askQuestion}
          currentAskerId={null} // Pass specific asker ID if we had it
        />
      )}
    </main>
  );
}
