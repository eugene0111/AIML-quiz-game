// Initial State
const initialGameState = {
  section: "setup",
  teams: {
    team1: { id: "team1", name: "Team 1", score: 0, players: [] },
    team2: { id: "team2", name: "Team 2", score: 0, players: [] },
  },
  currentRound: 1,
  activeTeamId: "team1", // "team1" | "team2"
  phase: "asking", // "asking" | "answering" | "grading"
  onlinePlayers: [],
};

// Simple in-memory store
class GameStore {
  constructor() {
    this.state = { ...initialGameState };
    // players: { id: string, name: string, teamId?: "team1" | "team2" }
    this.players = [];
  }

  getState() {
    return this.state;
  }

  updateOnlinePlayers() {
    this.state.onlinePlayers = this.players.map((p) => ({
      name: p.name,
      teamId: p.teamId,
    }));
  }

  addPlayer(id, name) {
    const existing = this.players.find((p) => p.id === id);
    if (!existing) {
      this.players.push({ id, name });
    }
    this.updateOnlinePlayers();
  }

  removePlayer(id) {
    this.players = this.players.filter((p) => p.id !== id);
    this.updateOnlinePlayers();
  }

  joinTeam(socketId, teamId) {
    const player = this.players.find((p) => p.id === socketId);
    if (!player) return;

    if (player.teamId) {
      // Remove from old team
      const oldTeam = this.state.teams[player.teamId];
      oldTeam.players = oldTeam.players.filter((name) => name !== player.name);
    }

    player.teamId = teamId;

    const newTeam = this.state.teams[teamId];
    if (!newTeam.players.includes(player.name)) {
      newTeam.players.push(player.name);
    }

    this.updateOnlinePlayers();
  }

  startGame(team1Name, team2Name) {
    this.state.teams.team1.name = team1Name;
    this.state.teams.team2.name = team2Name;

    this.state.section = "playing";
    this.state.phase = "asking";
    this.state.activeTeamId = "team1";

    this.state.teams.team1.score = 0;
    this.state.teams.team2.score = 0;
    this.state.currentRound = 1;
  }

  startAnswering(playerId) {
    if (this.state.phase !== "asking") return;

    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.teamId) return;

    // Only the asking (active) team can start answering
    if (player.teamId !== this.state.activeTeamId) return;

    this.state.phase = "answering";
  }

  raiseHand(playerId) {
    if (this.state.phase !== "answering") return false;

    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.teamId) return false;

    // Only the answering team can raise hand
    if (player.teamId === this.state.activeTeamId) return false;

    // Block others and move to grading
    this.state.phase = "grading";
    return true;
  }

  gradeAnswer(playerId, score) {
    if (this.state.phase !== "grading") return;

    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.teamId) return;

    // Only the asking team can grade
    if (player.teamId !== this.state.activeTeamId) return;

    const askingTeam = this.state.activeTeamId;
    const answeringTeam = askingTeam === "team1" ? "team2" : "team1";

    this.state.teams[answeringTeam].score += score;

    // Switch turns
    this.state.activeTeamId = answeringTeam;
    this.state.phase = "asking";
    this.state.currentRound += 1;
  }

  reset() {
    this.state = { ...initialGameState };
    this.players = [];
  }
}

export const gameStore = new GameStore();
