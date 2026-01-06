'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users } from 'lucide-react';

interface GameSetupProps {
  onStart: (team1Name: string, team2Name: string) => void;
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Quiz Battle
        </h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <User className="w-4 h-4 text-blue-400" />
              Team 1 Name
            </label>
            <input
              type="text"
              value={t1}
              onChange={(e) => setT1(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0a0a0a50] text-gray-500">VS</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Users className="w-4 h-4 text-purple-400" />
              Team 2 Name
            </label>
            <input
              type="text"
              value={t2}
              onChange={(e) => setT2(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (t1 && t2) onStart(t1, t2);
            }}
            disabled={!t1 || !t2}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
          >
            Start Battle
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
