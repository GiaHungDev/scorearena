'use client';

import React from 'react';
import { Player, GameMode, TableOrientation } from '../lib/types';
import { PlayerCard } from './PlayerCard';

interface GameBoardProps {
  playerCount: GameMode;
  tableOrientation: TableOrientation;
  players: Player[];
  onAddScore: (playerId: number, amount: number, reason: string) => void;
  onTriggerBell: (playerId: number) => void;
  onUpdateName: (playerId: number, name: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  playerCount,
  tableOrientation,
  players,
  onAddScore,
  onTriggerBell,
  onUpdateName
}) => {
  return (
    <main className="app-container">
      <div className={`game-board layout-${playerCount} orient-${tableOrientation}`}>
        {players.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            positionIndex={idx}
            onAddScore={onAddScore}
            onTriggerBell={onTriggerBell}
            onUpdateName={onUpdateName}
          />
        ))}
      </div>
    </main>
  );
};
