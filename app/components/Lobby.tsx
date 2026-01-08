'use client';

import { motion } from 'framer-motion';
import { User, Users, Play, Shield } from 'lucide-react';
import { GameState } from '../types';

interface LobbyProps {
  gameState: GameState;
  onJoinTeam: (teamId: 'team1' | 'team2') => void;
  onStartGame: (team1Name: string, team2Name: string) => void;
  currentPlayerName?: string;
}

export default function Lobby({ gameState, onJoinTeam, onStartGame, currentPlayerName }: LobbyProps) {
  const { teams, onlinePlayers } = gameState;
  
  const canStart = teams.team1.players.length > 0 && teams.team2.players.length > 0;

  // Filter unassigned players
  const unassigned = onlinePlayers?.filter(p => !p.teamId) || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-6xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-center mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Quiz Battle Lobby
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Join a team to get started
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Team 1 Panel */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {teams.team1.name}
            </h2>
            <div className="w-full grow mb-4 min-h-[100px]">
              <ul className="space-y-2">
                {teams.team1.players.map((player, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-blue-200 bg-blue-800/40 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4" />
                    {player}
                  </li>
                ))}
                {teams.team1.players.length === 0 && (
                  <li className="text-blue-500/50 text-center italic py-4">No players yet</li>
                )}
              </ul>
            </div>
            <button 
              onClick={() => onJoinTeam('team1')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors font-medium relative overflow-hidden group"
            >
              <span className="relative z-10">Join Team 1</span>
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>

          {/* Unassigned / Online Panel */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center">
             <h2 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
               <Users className="w-5 h-5" />
               Online ({onlinePlayers?.length || 0})
             </h2>
             <div className="w-full grow mb-4 min-h-[100px]">
               <ul className="space-y-2">
                 {unassigned.map((p, idx) => (
                   <li key={idx} className="flex items-center gap-2 text-gray-400 bg-black/20 px-3 py-2 rounded-lg">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     {p.name}
                   </li>
                 ))}
                 {unassigned.length === 0 && (
                    <li className="text-gray-600 text-center italic py-4 text-sm">Everyone is in a team!</li>
                 )}
               </ul>
             </div>
          </div>

          {/* Team 2 Panel */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {teams.team2.name}
            </h2>
             <div className="w-full grow mb-4 min-h-[100px]">
              <ul className="space-y-2">
                {teams.team2.players.map((player, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-purple-200 bg-purple-800/40 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4" />
                    {player}
                  </li>
                ))}
                 {teams.team2.players.length === 0 && (
                  <li className="text-purple-500/50 text-center italic py-4">No players yet</li>
                )}
              </ul>
            </div>
            <button 
               onClick={() => onJoinTeam('team2')}
               className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition-colors font-medium relative overflow-hidden group"
            >
               <span className="relative z-10">Join Team 2</span>
               <div className="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onStartGame(teams.team1.name, teams.team2.name)}
            disabled={!canStart}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Game
          </button>
        </div>
      </motion.div>
    </div>
  );
}
