'use client';

import React from 'react';
import { Player, HistoryItem } from '../lib/types';

interface HistoryModalProps {
  isOpen: boolean;
  players: Player[];
  history: HistoryItem[];
  currentRound: number;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  players,
  history,
  currentRound,
  onClose
}) => {
  if (!isOpen) return null;

  const scores = players.map((p) => p.score);
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const minScore = scores.length ? Math.min(...scores) : 0;
  const diff = maxScore - minScore;

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: '#00d2ff' }}>
            📊 KIỂM TRA CÂN BẰNG & NHẬT KÝ VÒNG CHƠI
          </h2>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div>
          {/* Balance summary */}
          <div
            id="balance-diff-info"
            style={{ fontSize: '0.95rem', color: '#ffaa00', marginBottom: '8px' }}
          >
            Chênh lệch nhất bảng: <strong>{diff} điểm</strong> (Cao nhất: {maxScore} - Thấp nhất: {minScore})
          </div>

          {/* Balance Table */}
          <table className="balance-table">
            <thead>
              <tr>
                <th>Nhân Vật / Người Chơi</th>
                <th style={{ textAlign: 'right' }}>Tổng Điểm</th>
                <th style={{ textAlign: 'center' }}>Trạng Thái Lượt</th>
                <th style={{ textAlign: 'right' }}>Cách Đáy</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const distanceToBottom = p.score - minScore;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{ display: 'inline-block', width: '28px', height: '28px' }}
                          dangerouslySetInnerHTML={{ __html: p.avatarSvg }}
                        />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong style={{ color: p.color, fontSize: '1.2rem' }}>
                        {p.score}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-pill ${p.hasInputRound ? 'pill-green' : 'pill-yellow'}`}>
                        {p.hasInputRound ? `Đã nhập V${currentRound}` : `Chờ nhập V${currentRound}`}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {distanceToBottom > 0 ? `+${distanceToBottom}` : '0 (Thấp nhất)'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* History Activity Logs */}
          <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0', margin: '16px 0 8px 0' }}>
            📜 Nhật Ký Điểm Gần Đây
          </h3>
          <div className="recent-logs-wrap">
            {history.length === 0 ? (
              <div className="empty-log">Chưa có lịch sử điểm số</div>
            ) : (
              history.slice(0, 20).map((item) => (
                <div key={item.id} className={`log-entry type-${item.type}`}>
                  <span className="log-time">[{item.time}]</span>
                  <span className="log-round">V{item.round}</span>
                  <span className="log-name">{item.playerName}</span>
                  <span className="log-reason">{item.reason}</span>
                  <span className={`log-amount ${item.amount >= 0 ? 'pos' : 'neg'}`}>
                    {item.amount > 0 ? '+' : ''}
                    {item.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
