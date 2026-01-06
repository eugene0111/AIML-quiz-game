'use client';

import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Team, TeamId } from '../types';
import clsx from 'clsx';

interface ScoreBoardProps {
  teams: { team1: Team; team2: Team };
  activeTeamId: TeamId;
}

export default function ScoreBoard({ teams, activeTeamId }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-12 gap-4">
      <TeamCard team={teams.team1} isActive={activeTeamId === 'team1'} color="blue" align="left" />
      
      <div className="flex flex-col items-center">
        <Trophy className="w-8 h-8 text-yellow-500 mb-1" />
        <span className="text-xs font-mono text-gray-500 tracking-widest">VS</span>
      </div>

      <TeamCard team={teams.team2} isActive={activeTeamId === 'team2'} color="purple" align="right" />
    </div>
  );
}

function TeamCard({ team, isActive, color, align }: { team: Team; isActive: boolean; color: 'blue' | 'purple'; align: 'left' | 'right' }) {
  return (
    <motion.div 
      animate={{ 
        scale: isActive ? 1.05 : 1,
        opacity: isActive ? 1 : 0.7
      }}
      className={clsx(
        "glass-panel rounded-xl p-6 flex-1 relative overflow-hidden transition-all duration-300",
        isActive && `border-${color}-500/50 shadow-${color}-500/20 shadow-lg`
      )}
    >
      <div className={clsx(
        "absolute top-0 w-24 h-24 bg-gradient-to-br opacity-20 blur-2xl rounded-full pointer-events-none",
        color === 'blue' ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500",
        align === 'left' ? "-left-4 -top-4" : "-right-4 -top-4"
      )} />
      
      <div className={clsx("flex flex-col relative z-20", align === 'right' ? "items-end text-right" : "items-start")}>
        <span className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-1">
          {team.name}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-5xl font-black text-white tracking-tighter">
            {team.score}
          </span>
          <Star className={clsx("w-5 h-5", color === 'blue' ? "text-blue-400" : "text-purple-400")} fill="currentColor" />
        </div>
      </div>
    </motion.div>
  );
}
