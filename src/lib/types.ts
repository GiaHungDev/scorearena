export interface Character {
  id: string;
  defaultName: string;
  title: string;
  color: string;
  colorLight: string;
  colorBorder: string;
  badge: string;
  avatarSvg: string;
}

export interface DeltaTag {
  id: string;
  amount: number;
  timestamp: number;
}

export interface Player {
  id: number;
  name: string;
  title: string;
  score: number;
  charId: string;
  hasInputRound: boolean;
  isAutoBalanced?: boolean;
  currentRoundDelta: number;
  activeTag: DeltaTag | null;
  avatarSvg: string;
  color: string;
  colorLight: string;
  colorBorder: string;
  badge: string;
}

export interface HistoryItem {
  id: string;
  round: number;
  time: string;
  playerName: string;
  amount: number;
  newScore: number;
  reason: string;
  type: 'score' | 'bell_success' | 'bell_blocked' | 'round_end';
}

export type GameMode = 4 | 5;
export type TableOrientation = 'standard' | 'tabletop';
