'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from '../lib/types';
import { soundCtrl } from '../lib/sound';
import confetti from 'canvas-confetti';

interface WheelModalProps {
  isOpen: boolean;
  players: Player[];
  onClose: () => void;
}

const WHEEL_COLORS = [
  '#ff3366', '#00d2ff', '#00ff88', '#ffaa00',
  '#c850fe', '#ff5722', '#3f51b5', '#e91e63'
];

export const WheelModal: React.FC<WheelModalProps> = ({
  isOpen,
  players,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<{ name: string; index: number } | null>(null);

  const angleRef = useRef<number>(0);
  const speedRef = useRef<number>(0);
  const isSpinningRef = useRef<boolean>(false);
  const lastSectorRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  // Sync initial names from players
  useEffect(() => {
    if (players.length > 0) {
      const playerNames = players.map((p) => p.name);
      setNames(playerNames);
      setTextareaValue(playerNames.join('\n'));
    }
  }, [players]);

  // Draw wheel function
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.parentElement?.clientWidth || 360, 420);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.min(centerX, centerY) - 16;
    const numSectors = names.length || 1;
    const arc = (2 * Math.PI) / numSectors;

    ctx.clearRect(0, 0, size, size);

    // Outer Glow Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Draw Sectors
    names.forEach((name, i) => {
      const angle = angleRef.current + i * arc;
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Plus Jakarta Sans", -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(name.length > 14 ? name.substring(0, 13) + '…' : name, radius - 20, 5);
      ctx.restore();

      ctx.restore();
    });

    // Center Hub Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00d2ff';
    ctx.stroke();

    // Center star / icon
    ctx.fillStyle = '#ffaa00';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', centerX, centerY);
    ctx.restore();

    // Pointer on the right (at 0 rad)
    ctx.save();
    ctx.translate(centerX + radius + 4, centerY);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(16, -12);
    ctx.lineTo(16, 12);
    ctx.closePath();
    ctx.fillStyle = '#ff3366';
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }, [names]);

  // Redraw when modal opens or names change
  useEffect(() => {
    if (isOpen) {
      setTimeout(drawWheel, 50);
    }
  }, [isOpen, drawWheel]);

  // Spin animation loop
  const animate = useCallback(() => {
    if (!isSpinningRef.current) return;

    angleRef.current += speedRef.current;
    speedRef.current *= 0.988; // Friction

    const arc = (2 * Math.PI) / (names.length || 1);
    const normalizedAngle = (2 * Math.PI - (angleRef.current % (2 * Math.PI))) % (2 * Math.PI);
    const currentSector = Math.floor(normalizedAngle / arc);

    if (currentSector !== lastSectorRef.current) {
      soundCtrl.playTick();
      lastSectorRef.current = currentSector;
    }

    drawWheel();

    if (speedRef.current <= 0.002) {
      isSpinningRef.current = false;
      setIsSpinning(false);
      speedRef.current = 0;
      drawWheel();

      const winName = names[currentSector] || names[0] || 'Người chơi';
      setWinner({ name: winName, index: currentSector });
      soundCtrl.playVictory();

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
      return;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawWheel, names]);

  const handleSpin = () => {
    if (isSpinningRef.current || names.length === 0) return;
    setWinner(null);
    isSpinningRef.current = true;
    setIsSpinning(true);
    speedRef.current = 0.38 + Math.random() * 0.22;
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleShuffle = () => {
    if (isSpinning) return;
    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setNames(shuffled);
    setTextareaValue(shuffled.join('\n'));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
    const parsed = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
    setNames(parsed);
  };

  const handleWinnerKeep = () => {
    setWinner(null);
  };

  const handleWinnerRemove = () => {
    if (winner) {
      const updated = names.filter((_, idx) => idx !== winner.index);
      setNames(updated);
      setTextareaValue(updated.join('\n'));
      setWinner(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: '#ff3366' }}>
            🎯 VÒNG QUAY NGƯỜI BẮT ĐẦU
          </h2>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="wheel-modal-body">
          {/* Wheel Canvas Container */}
          <div className="wheel-canvas-container">
            <canvas ref={canvasRef} />

            {/* Winner Announcement Overlay */}
            {winner && (
              <div className="winner-popup-wrap active">
                <div className="winner-trophy">👑</div>
                <div className="winner-title">NGƯỜI BẮT ĐẦU LÀ:</div>
                <div className="winner-name">{winner.name}</div>
                <div className="winner-actions">
                  <button className="btn-winner-keep" onClick={handleWinnerKeep}>
                    Giữ Lại
                  </button>
                  <button className="btn-winner-remove" onClick={handleWinnerRemove}>
                    Xóa Khỏi Vòng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wheel Sidebar Settings */}
          <div className="wheel-sidebar">
            <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#8c9cb8' }}>
              Danh sách tên (mỗi dòng một tên):
            </label>
            <textarea
              className="wheel-textarea"
              placeholder="Nhập tên người chơi..."
              value={textareaValue}
              onChange={handleTextareaChange}
              disabled={isSpinning}
            />

            <div className="wheel-action-row">
              <button
                className="btn-wheel-shuffle"
                onClick={handleShuffle}
                disabled={isSpinning || names.length <= 1}
                title="Xáo trộn vị trí các tên"
              >
                🔀 Xáo Trộn
              </button>
              <button
                className="btn-wheel-spin"
                onClick={handleSpin}
                disabled={isSpinning || names.length === 0}
              >
                {isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY!'}
              </button>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
              💡 <em>Vòng quay này độc lập với trò chơi tính điểm. Bạn có thể quay bất cứ lúc nào để chọn người đi trước hoặc bốc thăm may mắn.</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
