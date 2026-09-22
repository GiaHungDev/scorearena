'use client';

import React, { useState } from 'react';
import { Player, GameMode } from '../lib/types';

interface BellModalProps {
  isOpen: boolean;
  playerCount: GameMode;
  activePlayer: Player | null;
  players: Player[];
  onClose: () => void;
  onSuccess: () => void;
  onBlock: (blockerId: number) => void;
}

export const BellModal: React.FC<BellModalProps> = ({
  isOpen,
  playerCount,
  activePlayer,
  players,
  onClose,
  onSuccess,
  onBlock
}) => {
  const [showBlockerView, setShowBlockerView] = useState<boolean>(false);

  if (!isOpen || !activePlayer) return null;

  const successPts = playerCount === 4 ? 60 : 80;
  const blockerPts = playerCount === 4 ? 80 : 100;
  const otherPlayers = players.filter((p) => p.id !== activePlayer.id);

  const handleClose = () => {
    setShowBlockerView(false);
    onClose();
  };

  const handleSuccess = () => {
    setShowBlockerView(false);
    onSuccess();
  };

  const handleBlockSelect = (blockerId: number) => {
    setShowBlockerView(false);
    onBlock(blockerId);
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: '#ffaa00' }}>
            🔔 PHA TRANH CHẤP CHUÔNG
          </h2>
          <button className="btn-close-modal" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="bell-modal-content">
          <div className="bell-player-hero">
            <div
              className="bell-avatar-large"
              dangerouslySetInnerHTML={{ __html: activePlayer.avatarSvg }}
            />
            <div className="bell-player-name">{activePlayer.name}</div>
            <div className="bell-announcement">
              vừa RUNG CHUÔNG! Kết quả thế nào?
            </div>
          </div>

          {!showBlockerView ? (
            <div id="bell-choice-view">
              <div className="bell-decision-grid">
                <button
                  className="btn-bell-choice btn-bell-success"
                  onClick={handleSuccess}
                >
                  <span className="choice-title">✓ THÀNH CÔNG</span>
                  <span className="choice-pts">+{successPts}</span>
                  <span className="choice-desc">Các người chơi khác mỗi người -20 đ</span>
                </button>
                <button
                  className="btn-bell-choice btn-bell-fail"
                  onClick={() => setShowBlockerView(true)}
                >
                  <span className="choice-title">✕ THẤT BẠI / BỊ CHẶN</span>
                  <span className="choice-pts">Bị trừ -{blockerPts}</span>
                  <span className="choice-desc">Chọn người chặn (được +{blockerPts} đ)</span>
                </button>
              </div>
            </div>
          ) : (
            <div id="bell-blocker-view">
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#ff5c8a',
                  marginBottom: '10px'
                }}
              >
                🛡️ Ai là người đã chặn cú rung chuông?
              </div>
              <div className="blockers-grid">
                {otherPlayers.map((other) => (
                  <button
                    key={other.id}
                    className="btn-blocker-choice"
                    style={{
                      borderColor: other.colorBorder,
                      backgroundColor: other.colorLight
                    }}
                    onClick={() => handleBlockSelect(other.id)}
                  >
                    <div
                      className="blocker-avatar"
                      dangerouslySetInnerHTML={{ __html: other.avatarSvg }}
                    />
                    <div className="blocker-name">{other.name}</div>
                    <div className="blocker-bonus">+{blockerPts} đ</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
