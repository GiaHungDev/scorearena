'use client';

import React, { useState } from 'react';
import { GameMode, TableOrientation } from '../lib/types';

interface TopNavProps {
  playerCount: GameMode;
  onSetPlayerCount: (count: GameMode) => void;
  tableOrientation: TableOrientation;
  onToggleOrientation: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWheel: () => void;
  onOpenHistory: () => void;
  onOpenAudit: () => void;
  onResetGame: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  playerCount,
  onSetPlayerCount,
  tableOrientation,
  onToggleOrientation,
  soundEnabled,
  onToggleSound,
  onOpenWheel,
  onOpenHistory,
  onOpenAudit,
  onResetGame
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className={`top-nav-wrapper ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <header className="top-nav">
        <div className="brand">
          <span className="brand-icon">⚔️</span>
          <span className="brand-title">Score Arena</span>
        </div>

        <nav className="nav-actions">
          {/* 4 or 5 Players Toggle */}
          <button
            className={`btn-nav ${playerCount === 4 ? 'active' : ''}`}
            onClick={() => onSetPlayerCount(4)}
            title="Chế độ 4 người (4 Góc)"
          >
            👥 4 Người
          </button>
          <button
            className={`btn-nav ${playerCount === 5 ? 'active' : ''}`}
            onClick={() => onSetPlayerCount(5)}
            title="Chế độ 5 người (Ngũ Giác)"
          >
            ⭐ 5 Người
          </button>

          {/* Audit / Check Lệch Số */}
          <button
            className="btn-nav btn-audit-nav"
            onClick={onOpenAudit}
            title="Kiểm tra lệch số, tổng điểm vòng & cân bằng bàn chơi"
          >
            🔍 Kiểm Tra Lệch Số
          </button>

          {/* Wheel of Names */}
          <button
            className="btn-nav btn-wheel-special"
            onClick={onOpenWheel}
            title="Mở vòng quay chọn người bắt đầu"
          >
            🎯 Người Bắt Đầu
          </button>

          {/* Tabletop 360 Mode */}
          <button
            className={`btn-nav ${tableOrientation === 'tabletop' ? 'active' : ''}`}
            onClick={onToggleOrientation}
            title="Xoay hướng thẻ về phía người ngồi đối diện trên iPad"
          >
            🔄 Xoay Mặt Bàn
          </button>

          {/* Balance & History */}
          <button
            className="btn-nav"
            onClick={onOpenHistory}
            title="Kiểm tra cân bằng và lịch sử điểm"
          >
            📊 Cân Bằng & Nhật Ký
          </button>

          {/* Sound Toggle */}
          <button
            className={`btn-nav ${!soundEnabled ? 'btn-muted' : ''}`}
            onClick={onToggleSound}
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? '🔊 Âm thanh: BẬT' : '🔇 Âm thanh: TẮT'}
          </button>

          {/* Reset Game */}
          <button
            className="btn-nav"
            onClick={onResetGame}
            title="Đặt lại ván chơi mới"
          >
            ⚡ Ván Mới
          </button>
        </nav>
      </header>

      {/* Push Up / Pull Down Toggle Handle */}
      <button
        className="btn-toggle-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Kéo thanh công cụ xuống' : 'Đẩy thanh công cụ lên'}
      >
        <span className="toggle-icon">{isCollapsed ? '▼ Kéo Xuống' : '▲ Đẩy Lên'}</span>
      </button>
    </div>
  );
};
