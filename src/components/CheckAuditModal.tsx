'use client';

import React from 'react';
import { Player, HistoryItem } from '../lib/types';

interface CheckAuditModalProps {
  isOpen: boolean;
  players: Player[];
  currentRound: number;
  history: HistoryItem[];
  onClose: () => void;
  onAdvanceNextRound: () => void;
}

export const CheckAuditModal: React.FC<CheckAuditModalProps> = ({
  isOpen,
  players,
  currentRound,
  history,
  onClose,
  onAdvanceNextRound
}) => {
  if (!isOpen) return null;

  const scores = players.map((p) => p.score);
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const minScore = scores.length ? Math.min(...scores) : 0;
  const totalScorePool = scores.reduce((sum, s) => sum + s, 0);
  const gap = maxScore - minScore;

  const roundDeltas = players.map((p) => p.currentRoundDelta);
  const roundTotalDelta = roundDeltas.reduce((sum, d) => sum + d, 0);
  const unsubmittedPlayers = players.filter((p) => !p.hasInputRound);
  const submittedPlayers = players.filter((p) => p.hasInputRound);

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔍</span>
            <div>
              <h2 className="modal-title" style={{ color: '#00d2ff', margin: 0 }}>
                KIỂM TRA LỆCH SỐ & CÂN BẰNG BÀN CHƠI
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Phân tích chi tiết số điểm Vòng {currentRound} & Bảng xếp hạng toàn bàn
              </div>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="audit-content">
          <div className="audit-section-card" style={{ borderColor: unsubmittedPlayers.length > 0 ? '#ffaa00' : '#00ff88' }}>
            <div className="audit-section-header">
              <span className="section-badge">VÒNG {currentRound}</span>
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                Trạng Thái Bấm Điểm Vòng Này
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Tổng điểm vòng: <strong style={{ color: roundTotalDelta >= 0 ? '#00ff88' : '#ff3366', fontSize: '1.05rem' }}>
                  {roundTotalDelta > 0 ? `+${roundTotalDelta}` : roundTotalDelta} đ
                </strong>
              </span>
            </div>

            {unsubmittedPlayers.length > 0 ? (
              <div className="audit-alert-box warning">
                ⚠️ <strong>Cảnh báo lệch số:</strong> Có <strong>{unsubmittedPlayers.length}/{players.length}</strong> người chơi chưa bấm điểm vòng {currentRound} ({unsubmittedPlayers.map(p => p.name).join(', ')}).
              </div>
            ) : (
              <div className="audit-alert-box success">
                ✓ <strong>Đầy đủ:</strong> Tất cả {players.length} người chơi đã xác nhận điểm cho Vòng {currentRound}.
              </div>
            )}

            <div className="audit-players-grid">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`audit-player-pill ${p.hasInputRound ? 'done' : 'missing'}`}
                  style={{ borderLeftColor: p.color }}
                >
                  <div className="pill-avatar" dangerouslySetInnerHTML={{ __html: p.avatarSvg }} />
                  <div className="pill-info">
                    <div className="pill-name">{p.name}</div>
                    <div className="pill-round-status">
                      {p.hasInputRound ? (
                        <span style={{ color: '#00ff88' }}>
                          V{currentRound}: <strong>{p.currentRoundDelta > 0 ? `+${p.currentRoundDelta}` : p.currentRoundDelta} đ</strong>
                        </span>
                      ) : (
                        <span style={{ color: '#ff5577', fontWeight: 700 }}>⏳ Chưa bấm điểm</span>
                      )}
                    </div>
                  </div>
                  <div className="pill-total-score" style={{ color: p.color }}>
                    {p.score} đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="audit-section-card">
            <div className="audit-section-header">
              <span className="section-badge" style={{ background: '#ffaa00', color: '#000' }}>TOÀN BÀN</span>
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                Độ Lệch Số Giữa Các Người Chơi
              </span>
            </div>

            <div className="audit-metrics-row">
              <div className="metric-box">
                <div className="metric-label">ĐỘ LỆCH ĐỈNH - ĐÁY</div>
                <div className="metric-val" style={{ color: gap > 50 ? '#ff5c8a' : '#00d2ff' }}>
                  {gap} <span style={{ fontSize: '0.85rem' }}>điểm</span>
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">ĐIỂM CAO NHẤT</div>
                <div className="metric-val" style={{ color: '#00ff88' }}>
                  {maxScore} <span style={{ fontSize: '0.85rem' }}>đ</span>
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">ĐIỂM THẤP NHẤT</div>
                <div className="metric-val" style={{ color: '#ff3366' }}>
                  {minScore} <span style={{ fontSize: '0.85rem' }}>đ</span>
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TỔNG QUỸ ĐIỂM</div>
                <div className="metric-val" style={{ color: '#ffaa00' }}>
                  {totalScorePool} <span style={{ fontSize: '0.85rem' }}>đ</span>
                </div>
              </div>
            </div>

            <table className="balance-table" style={{ margin: '10px 0 0 0' }}>
              <thead>
                <tr>
                  <th>Xếp hạng / Người chơi</th>
                  <th style={{ textAlign: 'right' }}>Tổng Điểm</th>
                  <th style={{ textAlign: 'right' }}>Cách Đỉnh (Hạng 1)</th>
                  <th style={{ textAlign: 'right' }}>Cách Đáy (Bét bảng)</th>
                  <th style={{ textAlign: 'center' }}>Vòng {currentRound}</th>
                </tr>
              </thead>
              <tbody>
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((p, rank) => {
                    const gapFromTop = maxScore - p.score;
                    const gapFromBottom = p.score - minScore;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, color: rank === 0 ? '#ffaa00' : '#8c9cb8', width: '20px' }}>
                              #{rank + 1}
                            </span>
                            <span
                              style={{ display: 'inline-block', width: '26px', height: '26px' }}
                              dangerouslySetInnerHTML={{ __html: p.avatarSvg }}
                            />
                            <strong>{p.name}</strong>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <strong style={{ color: p.color, fontSize: '1.15rem' }}>{p.score}</strong>
                        </td>
                        <td style={{ textAlign: 'right', color: gapFromTop === 0 ? '#00ff88' : '#cbd5e1' }}>
                          {gapFromTop === 0 ? '👑 Dẫn Đầu' : `-${gapFromTop}`}
                        </td>
                        <td style={{ textAlign: 'right', color: gapFromBottom === 0 ? '#ff5c8a' : '#00ff88' }}>
                          {gapFromBottom === 0 ? '⚓ Thấp nhất' : `+${gapFromBottom}`}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`status-pill ${p.hasInputRound ? 'pill-green' : 'pill-yellow'}`}>
                            {p.hasInputRound ? `Đã nhập (${p.currentRoundDelta > 0 ? '+' : ''}${p.currentRoundDelta})` : 'Chờ bấm'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="audit-footer-actions">
            <button className="btn-modal-secondary" onClick={onClose}>
              Đóng Kiểm Tra
            </button>
            <button
              className="btn-modal-primary"
              onClick={() => {
                onAdvanceNextRound();
                onClose();
              }}
            >
              {unsubmittedPlayers.length === 0 ? '✨ Xác Nhận Sang Vòng Mới' : '⚡ Bỏ Qua & Sang Vòng Mới'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
