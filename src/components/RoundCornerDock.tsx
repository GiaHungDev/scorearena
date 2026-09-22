'use client';

import React, { useState } from 'react';

interface RoundCornerDockProps {
  currentRound: number;
  submittedCount: number;
  totalPlayers: number;
  onAdvanceNextRound: () => void;
  onOpenAudit: () => void;
  autoAdvanceCountdown?: number | null;
}

export const RoundCornerDock: React.FC<RoundCornerDockProps> = ({
  currentRound,
  submittedCount,
  totalPlayers,
  onAdvanceNextRound,
  onOpenAudit,
  autoAdvanceCountdown
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const isAllSubmitted = submittedCount === totalPlayers;
  const progressPercent = (submittedCount / totalPlayers) * 100;
  const isCountingDown = typeof autoAdvanceCountdown === 'number' && autoAdvanceCountdown > 0;

  if (isMinimized) {
    return (
      <div className="round-corner-dock minimized" onClick={() => setIsMinimized(false)} title="Bấm để mở rộng bảng điều khiển vòng">
        <div className="dock-min-badge">V{currentRound}</div>
        <div className="dock-min-status">
          {isCountingDown ? `⏱️ ${autoAdvanceCountdown}s` : `${submittedCount}/${totalPlayers}`}
        </div>
        <span className="dock-expand-icon">🔼</span>
      </div>
    );
  }

  return (
    <aside className="round-corner-dock" aria-label="Bảng điều khiển vòng chơi">
      <div className="dock-header">
        <div className="dock-round-tag">
          <span className="dock-round-icon">🏆</span>
          <span className="dock-round-title">VÒNG {currentRound}</span>
        </div>
        <button
          className="btn-dock-minimize"
          onClick={() => setIsMinimized(true)}
          title="Thu nhỏ bảng điều khiển"
        >
          ⎯
        </button>
      </div>

      <div className="dock-status-row">
        <span className="dock-status-label">
          {isCountingDown ? '⏱️ Tự qua vòng sau:' : 'Tiến độ vòng:'}
        </span>
        <span className={`dock-status-val ${isCountingDown ? 'all-done auto-pulse' : isAllSubmitted ? 'all-done' : ''}`}>
          {isCountingDown ? `${autoAdvanceCountdown}s` : `${submittedCount}/${totalPlayers} đã bấm`}
        </span>
      </div>

      <div className="dock-progress-bar">
        <div
          className="dock-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="dock-actions-row">
        <button
          className="btn-dock-audit"
          onClick={onOpenAudit}
          title="Kiểm tra lệch số, tổng điểm vòng & cân bằng bàn chơi"
        >
          🔍 Kiểm Tra
        </button>

        <button
          className={`btn-dock-next ${isCountingDown ? 'auto-advancing' : ''}`}
          onClick={onAdvanceNextRound}
          title={isCountingDown ? `Bấm để sang ngay Vòng ${currentRound + 1}` : 'Kết thúc vòng và chuyển sang vòng tiếp theo'}
        >
          {isCountingDown
            ? `✨ V${currentRound + 1} (${autoAdvanceCountdown}s)`
            : isAllSubmitted
            ? '✨ Sang Vòng'
            : '⚡ Kết Thúc'}
        </button>
      </div>
    </aside>
  );
};
