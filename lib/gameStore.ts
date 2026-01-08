import { GameState, Team, TeamId } from "@/app/types"; // Adjust import path as needed

// Initial State
const initialGameState: GameState = {
  section: 'setup',
  teams: {
    team1: { id: 'team1', name: 'Team 1', score: 0, players: [] },
    team2: { id: 'team2', name: 'Team 2', score: 0, players: [] },
  },
  currentRound: 1,
  activeTeamId: 'team1',
  phase: 'asking',
  onlinePlayers: [],
};

// Simple in-memory store
class GameStore {
  private state: GameState = { ...initialGameState };
  private players: { id: string; name: string; teamId?: TeamId }[] = [];

  getState() {
    return this.state;
  }

  private updateOnlinePlayers() {
    this.state.onlinePlayers = this.players.map(p => ({
        name: p.name,
        teamId: p.teamId
    }));
  }

  addPlayer(id: string, name: string) {
    // Prevent duplicates if same socket/name re-joins (simplified)
    const existing = this.players.find(p => p.id === id);
    if (!existing) {
        this.players.push({ id, name });
    }
    this.updateOnlinePlayers();
  }

  removePlayer(id: string) {
    this.players = this.players.filter(p => p.id !== id);
    this.updateOnlinePlayers();
  }

  joinTeam(socketId: string, teamId: TeamId) {
    const player = this.players.find(p => p.id === socketId);
    if (player) {
      if (player.teamId) {
        // Remove from old team
        const oldTeam = this.state.teams[player.teamId];
        oldTeam.players = oldTeam.players.filter(name => name !== player.name);
      }
      player.teamId = teamId;
      // Add to new team
      const newTeam = this.state.teams[teamId];
      if (!newTeam.players.includes(player.name)) {
        newTeam.players.push(player.name);
      }
      this.updateOnlinePlayers();
    }
  }

  // ... existing methods

  startGame(team1Name: string, team2Name: string) {
    this.state.teams.team1.name = team1Name;
    this.state.teams.team2.name = team2Name;
    this.state.section = 'playing';
    this.state.phase = 'asking';
    this.state.activeTeamId = 'team1';
    // Reset scores
    this.state.teams.team1.score = 0;
    this.state.teams.team2.score = 0;
    this.state.currentRound = 1;
  }

  startAnswering(playerId: string) {
    if (this.state.phase !== 'asking') return;
      
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.teamId) return;

    // RULE: Only the active team (asking team) can start answering phase.
    if (player.teamId !== this.state.activeTeamId) return;

    this.state.phase = 'answering';
  }

  setAsker(playerId: string) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;
    
    // Logic to set who is asking. 
    // For now, we assume the activeTeamId is the one asking.
    // Ideally we track specific asker.
    this.state.phase = 'answering';
    // We might want to store who is specifically asking if needed.
  }

  raiseHand(playerId: string) {
    if (this.state.phase !== 'answering') return false;
    
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.teamId) return false;

    // RULE: Only the answering team can raise hand.
    // activeTeamId = Asking Team.
    // So player.teamId MUST NOT be activeTeamId.
    if (player.teamId === this.state.activeTeamId) return false;

    // Use a blocked flag or just check if we are already in grading
    // The requirement says "blocked for everyone else".
    // So we transition to 'grading' phase immediately or a temporary 'blocked' state.
    
    this.state.phase = 'grading'; 
    // In a real app we might want a "answering" state where they are talking, then "grading".
    // But user said "blocked for everyone else... then... grades".
    // So 'grading' implies the asker is now in control to grade.
    
    return true;
  }

  gradeAnswer(playerId: string, score: 0 | 0.5 | 1) {
    if (this.state.phase !== 'grading') return;

    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.teamId) return;

    // RULE: Only the asking team can grade.
    if (player.teamId !== this.state.activeTeamId) return;

    // The team that answered gets the points.
    // The activeTeamId was the one ASKING. So the OTHER team answered.
    const askingTeam = this.state.activeTeamId;
    const answeringTeam = askingTeam === 'team1' ? 'team2' : 'team1';

    this.state.teams[answeringTeam].score += score;
    
    // Switch turns
    this.state.activeTeamId = answeringTeam;
    this.state.phase = 'asking';
    this.state.currentRound += 1; // Simplified round increment
  }

  reset() {
      this.state = { ...initialGameState };
      this.players = [];
  }
}

export const gameStore = new GameStore();
