'use client';

import React from 'react';
import { useScorekeeper } from '../hooks/useScorekeeper';
import { TopNav } from '../components/TopNav';
import { GameBoard } from '../components/GameBoard';
import { RoundCornerDock } from '../components/RoundCornerDock';
import { BellModal } from '../components/BellModal';
import { WheelModal } from '../components/WheelModal';
import { HistoryModal } from '../components/HistoryModal';
import { CheckAuditModal } from '../components/CheckAuditModal';
import { ConfirmModal } from '../components/ConfirmModal';

export default function HomePage() {
  const {
    playerCount,
    setPlayerCount,
    currentRound,
    players,
    history,
    tableOrientation,
    toggleTableOrientation,
    soundEnabled,
    toggleSound,
    updatePlayerName,
    addScore,
    advanceNextRound,
    resetGame,
    showBellModal,
    bellActivePlayer,
    triggerBell,
    resolveBellSuccess,
    resolveBellBlock,
    setShowBellModal,
    showWheelModal,
    setShowWheelModal,
    showHistoryModal,
    setShowHistoryModal,
    showAuditModal,
    setShowAuditModal,
    autoAdvanceCountdown,
    confirmDialog,
    closeConfirmDialog
  } = useScorekeeper();

  const submittedCount = players.filter((p) => p.hasInputRound).length;

  return (
    <>
      <TopNav
        playerCount={playerCount}
        onSetPlayerCount={setPlayerCount}
        tableOrientation={tableOrientation}
        onToggleOrientation={toggleTableOrientation}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenWheel={() => setShowWheelModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenAudit={() => setShowAuditModal(true)}
        onResetGame={resetGame}
      />

      <GameBoard
        playerCount={playerCount}
        tableOrientation={tableOrientation}
        players={players}
        onAddScore={addScore}
        onTriggerBell={triggerBell}
        onUpdateName={updatePlayerName}
      />

      <RoundCornerDock
        currentRound={currentRound}
        submittedCount={submittedCount}
        totalPlayers={playerCount}
        onAdvanceNextRound={advanceNextRound}
        onOpenAudit={() => setShowAuditModal(true)}
        autoAdvanceCountdown={autoAdvanceCountdown}
      />

      <CheckAuditModal
        isOpen={showAuditModal}
        players={players}
        currentRound={currentRound}
        history={history}
        onClose={() => setShowAuditModal(false)}
        onAdvanceNextRound={advanceNextRound}
      />

      <BellModal
        isOpen={showBellModal}
        playerCount={playerCount}
        activePlayer={bellActivePlayer}
        players={players}
        onClose={() => setShowBellModal(false)}
        onSuccess={resolveBellSuccess}
        onBlock={resolveBellBlock}
      />

      <WheelModal
        isOpen={showWheelModal}
        players={players}
        onClose={() => setShowWheelModal(false)}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        players={players}
        history={history}
        currentRound={currentRound}
        onClose={() => setShowHistoryModal(false)}
      />

      <ConfirmModal
        isOpen={!!confirmDialog?.isOpen}
        title={confirmDialog?.title || ''}
        message={confirmDialog?.message || ''}
        confirmText={confirmDialog?.confirmText}
        cancelText={confirmDialog?.cancelText}
        confirmVariant={confirmDialog?.confirmVariant}
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={closeConfirmDialog}
      />
    </>
  );
}
