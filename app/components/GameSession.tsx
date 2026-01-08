'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageCircle, Gavel, Hand } from 'lucide-react';
import { GameState } from '../types';
import ScoreBoard from './ScoreBoard';

interface GameSessionProps {
  initialState: GameState;
  onRaiseHand: () => void;
  onGradeAnswer: (score: 0 | 0.5 | 1) => void;
  onAskQuestion: () => void;
  currentAskerId: string | null;
}

export default function GameSession({ 
  initialState, 
  onRaiseHand, 
  onGradeAnswer, 
  onAskQuestion, 
  currentAskerId 
}: GameSessionProps) {
  const [pointsInput, setPointsInput] = useState<string>('');
  
  const { teams, activeTeamId, phase } = initialState;
  const askingTeam = teams[activeTeamId];
  const answeringTeam = activeTeamId === 'team1' ? teams.team2 : teams.team1;

  // We need to know which team the CURRENT USER is in to show/hide buttons.
  // Ideally this is passed as prop or we infer from context/socket.
  // For now, buttons are visible to everyone but actions might be validated on server.
  // However, UI should guide user.
  // Since we don't have current user TeamID here easily without passing it,
  // we will show buttons and letting server/socket handle validation or
  // we should assume the Page passes currentUserTeamId.
  // For MVP, show buttons broadly or improve props.
  // "visible to everyone" -> The board is visible. Controls should be restricted.
  
  // Let's assume on server validation returns error or just doesn't work if wrong team.
  // BETTER: Page passes `userTeamId`.

  const handleScoreSubmit = () => {
    const points = parseFloat(pointsInput);
    if (isNaN(points) || (points !== 0 && points !== 0.5 && points !== 1)) return;
    onGradeAnswer(points as 0 | 0.5 | 1);
    setPointsInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <ScoreBoard teams={teams} activeTeamId={activeTeamId} />
      
      <div className="relative min-h-[400px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ASKING PHASE */}
          {phase === 'asking' && (
            <motion.div 
              key="asking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="glass-panel p-10 rounded-2xl text-center w-full max-w-2xl"
            >
              <div className="inline-flex p-3 rounded-full bg-blue-500/20 text-blue-300 mb-6">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <span className={activeTeamId === 'team1' ? "text-blue-400" : "text-purple-400"}>
                  {askingTeam.name}
                </span>
                , Ask Your Question!
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Present your question clearly to {answeringTeam.name}.
              </p>
              
              <button 
                onClick={onAskQuestion}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
              >
                Question Asked <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ANSWERING PHASE */}
          {phase === 'answering' && (
            <motion.div 
              key="answering"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-10 rounded-2xl text-center w-full max-w-2xl border-l-4 border-yellow-500/50"
            >
              <div className="inline-flex p-3 rounded-full bg-yellow-500/20 text-yellow-300 mb-6">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <span className={activeTeamId === 'team1' ? "text-purple-400" : "text-blue-400"}>
                  {answeringTeam.name}
                </span>
                , Answer the Question!
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Raise your hand to answer! (First to click wins)
              </p>
              
              <button 
                onClick={onRaiseHand}
                className="bg-yellow-500 text-black px-10 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors flex items-center gap-3 mx-auto text-xl shadow-lg shadow-yellow-500/20"
              >
                <Hand className="w-6 h-6" />
                RAISE HAND
              </button>
            </motion.div>
          )}

          {/* GRADING PHASE */}
          {phase === 'grading' && (
            <motion.div 
              key="grading"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              className="glass-panel p-8 rounded-2xl text-center w-full max-w-md bg-gradient-to-b from-white/10 to-transparent"
            >
              <div className="inline-flex p-3 rounded-full bg-green-500/20 text-green-300 mb-6">
                <Gavel className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-6">
                Grade the Answer
              </h2>
              <p className="text-gray-400 mb-6">
                <span className={activeTeamId === 'team1' ? "text-blue-400" : "text-purple-400"}>{askingTeam.name}</span>
                , rate the answer:
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                 <button 
                    onClick={() => onGradeAnswer(0)}
                    className="p-4 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-xl text-red-300 font-bold transition-all"
                 >
                    0
                 </button>
                 <button 
                    onClick={() => onGradeAnswer(0.5)}
                    className="p-4 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50 rounded-xl text-yellow-300 font-bold transition-all"
                 >
                    0.5
                 </button>
                 <button 
                    onClick={() => onGradeAnswer(1)}
                    className="p-4 bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 rounded-xl text-green-300 font-bold transition-all"
                 >
                    1
                 </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-4">
                  Only the asking team should grade
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center mt-12 space-y-2">
        <div className="text-sm text-gray-600 font-mono">
           Round {initialState.currentRound}
        </div>
        {initialState.onlinePlayers && (
            <div className="text-xs text-gray-700">
                Spectators: {initialState.onlinePlayers.filter(p => !p.teamId).map(p => p.name).join(', ') || 'None'}
            </div>
        )}
      </div>
    </div>
  );
}
