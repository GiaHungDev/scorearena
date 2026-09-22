'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { soundCtrl } from '../lib/sound';

interface PlayerCardProps {
  player: Player;
  positionIndex: number;
  onAddScore: (playerId: number, amount: number, reason: string) => void;
  onTriggerBell: (playerId: number) => void;
  onUpdateName: (playerId: number, name: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  positionIndex,
  onAddScore,
  onTriggerBell,
  onUpdateName
}) => {
  const [customValue, setCustomValue] = useState<string>('');
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const keypadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (keypadRef.current && !keypadRef.current.contains(e.target as Node)) {
        setShowKeypad(false);
      }
    };
    if (showKeypad) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showKeypad]);

  const handleDigit = (digit: string) => {
    soundCtrl.playTick();
    setCustomValue(prev => {
      if (prev === '0' && digit !== '0') return digit;
      if (prev.length >= 4) return prev;
      return prev + digit;
    });
  };

  const handleBackspace = () => {
    soundCtrl.playTick();
    setCustomValue(prev => prev.slice(0, -1));
  };

  const handlePlus = () => {
    let amount = 1;
    if (customValue.trim() !== '') {
      const parsed = parseInt(customValue, 10);
      amount = !isNaN(parsed) ? Math.abs(parsed) : 0;
    }
    onAddScore(player.id, amount, amount === 0 ? '0 điểm' : `+${amount} điểm`);
    setCustomValue('');
    setShowKeypad(false);
  };

  const handleMinus = () => {
    let amount = 1;
    if (customValue.trim() !== '') {
      const parsed = parseInt(customValue, 10);
      amount = !isNaN(parsed) ? Math.abs(parsed) : 0;
    }
    onAddScore(player.id, -amount, amount === 0 ? '0 điểm' : `-${amount} điểm`);
    setCustomValue('');
    setShowKeypad(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePlus();
    }
  };

  return (
    <div
      ref={keypadRef}
      id={`player-card-${player.id}`}
      className={`player-card pos-p${positionIndex + 1} ${
        player.hasInputRound ? 'submitted' : 'pending'
      }`}
      style={{
        '--player-color': player.color,
        '--player-color-light': player.colorLight,
        '--player-color-border': player.colorBorder
      } as React.CSSProperties}
    >
      <div className="card-header">
        <div className="player-avatar-wrap">
          <div
            className="avatar-container"
            dangerouslySetInnerHTML={{ __html: player.avatarSvg }}
          />
          <span className="player-badge">{player.badge}</span>
        </div>
        <div className="player-info">
          <input
            type="text"
            className="player-name-input"
            value={player.name}
            onChange={(e) => onUpdateName(player.id, e.target.value)}
          />
          <span className="player-title">{player.title}</span>
        </div>
        <div className={`player-status-tag ${player.hasInputRound ? 'done' : 'waiting'}`}>
          {player.hasInputRound
            ? `✓ ${player.currentRoundDelta > 0 ? '+' : ''}${player.currentRoundDelta}`
            : '⏳ Chưa bấm'}
        </div>
      </div>

      <div className="card-score-display">
        <div className="score-label">ĐIỂM SỐ</div>
        <motion.div
          className="score-value"
          key={player.score}
          initial={{ scale: 1.25, color: '#ffff00' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        >
          {player.score}
        </motion.div>
        
        <AnimatePresence mode="popLayout">
          {player.activeTag && (
            <motion.div
              key={player.activeTag.id}
              initial={{ opacity: 0, y: 16, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -18,
                scale: 0.8,
                filter: 'blur(3px)',
                transition: { duration: 0.55, ease: 'easeOut' }
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 24
              }}
              className={`score-delta-tag ${
                player.activeTag.amount > 0
                  ? 'plus'
                  : player.activeTag.amount < 0
                  ? 'minus'
                  : 'zero'
              }`}
            >
              {player.activeTag.amount > 0
                ? `+${player.activeTag.amount}`
                : player.activeTag.amount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="card-controls">
        <div className="card-bell-section">
          <button
            className="btn-rung-chuong"
            onClick={() => onTriggerBell(player.id)}
          >
            <span className="bell-icon">🔔</span> RUNG CHUÔNG!
          </button>
        </div>

        <div className="score-stepper-row">
          <button
            type="button"
            className="btn-score-adjust btn-minus"
            onClick={handleMinus}
            title="Trừ điểm theo số trong ô (hoặc -1 nếu để trống)"
          >
            −
          </button>
          <input
            type="text"
            readOnly
            inputMode="none"
            className="input-custom-score"
            placeholder="Số điểm"
            value={customValue}
            onClick={() => setShowKeypad(prev => !prev)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="btn-score-adjust btn-plus"
            onClick={handlePlus}
            title="Cộng điểm theo số trong ô (hoặc +1 nếu để trống)"
          >
            +
          </button>
        </div>

        <AnimatePresence>
          {showKeypad && (
            <motion.div
              className="card-keypad-popover"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              <div className="popover-keypad-grid">
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('7')}>7</button>
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('8')}>8</button>
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('9')}>9</button>

                <button type="button" className="btn-pop-num" onClick={() => handleDigit('4')}>4</button>
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('5')}>5</button>
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('6')}>6</button>

                <button type="button" className="btn-pop-num" onClick={() => handleDigit('1')}>1</button>
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('2')}>2</button>
                <button type="button" className="btn-pop-num" onClick={() => handleDigit('3')}>3</button>

                <button type="button" className="btn-pop-num" onClick={() => handleDigit('0')}>0</button>
                <button type="button" className="btn-pop-num btn-pop-del" onClick={handleBackspace} title="Xóa lùi">⌫</button>
                <button type="button" className="btn-pop-num btn-pop-close" onClick={() => setShowKeypad(false)} title="Đóng">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
