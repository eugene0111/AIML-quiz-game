'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageCircle, Gavel } from 'lucide-react';
import { GameState, TeamId } from '../types';
import ScoreBoard from './ScoreBoard';
import clsx from 'clsx';

interface GameSessionProps {
  initialState: GameState;
  onUpdateState: (newState: GameState) => void;
}

export default function GameSession({ initialState, onUpdateState }: GameSessionProps) {
  const [pointsInput, setPointsInput] = useState<string>('');
  
  const { teams, activeTeamId, phase } = initialState;
  const askingTeam = teams[activeTeamId];
  const answeringTeam = activeTeamId === 'team1' ? teams.team2 : teams.team1;

  const handleNextPhase = () => {
    const nextState = { ...initialState };
    
    if (phase === 'asking') {
      nextState.phase = 'answering';
    } else if (phase === 'answering') {
      nextState.phase = 'grading';
    }
    
    onUpdateState(nextState);
  };

  const handleScoreSubmit = () => {
    const points = parseInt(pointsInput, 10);
    if (isNaN(points)) return;

    const nextState = { ...initialState };
    
    // Update score of the ANSWERING team
    if (activeTeamId === 'team1') {
      nextState.teams.team2.score += points;
      nextState.activeTeamId = 'team2'; // Switch turns
    } else {
      nextState.teams.team1.score += points;
      nextState.activeTeamId = 'team1'; // Switch turns
    }
    
    nextState.phase = 'asking'; // Reset phase
    nextState.currentRound += 1;
    
    setPointsInput('');
    onUpdateState(nextState);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <ScoreBoard teams={teams} activeTeamId={activeTeamId} />
      
      <div className="relative min-h-[400px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
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
                onClick={handleNextPhase}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
              >
                Question Asked <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

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
                , Give Your Answer!
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Take your time. Good luck!
              </p>
              <button 
                onClick={handleNextPhase}
                className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 mx-auto"
              >
                Answer Completed <CheckCircle className="w-4 h-4" />
              </button>
            </motion.div>
          )}

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
                , how many points do you award?
              </p>
              
              <div className="flex gap-4 justify-center mb-8">
                <input 
                  type="number" 
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  placeholder="0"
                  className="w-24 bg-black/40 border border-white/20 rounded-xl text-center text-3xl p-2 focus:border-green-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <button 
                onClick={handleScoreSubmit}
                disabled={pointsInput === ''}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-green-500/20"
              >
                Confirm Score
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center mt-12 text-sm text-gray-600 font-mono">
        Round {initialState.currentRound}
      </div>
    </div>
  );
}
