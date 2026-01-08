export type TeamId = 'team1' | 'team2';

export interface Team {
  id: TeamId;
  name: string;
  score: number;
  players: string[]; // List of player names
}

export type GamePhase = 'setup' | 'asking' | 'answering' | 'grading';

export interface GameState {
  section: 'setup' | 'playing' | 'gameover';
  teams: {
    team1: Team;
    team2: Team;
  };
  currentRound: number;
  activeTeamId: TeamId; // The team whose "turn" it is (Starts as asking)
  phase: GamePhase;
  onlinePlayers: { name: string; teamId?: TeamId }[];
}
