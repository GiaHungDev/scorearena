'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Player, HistoryItem, GameMode, TableOrientation, DeltaTag } from '../lib/types';
import { ANIME_CHARACTERS } from '../lib/characters';
import { soundCtrl } from '../lib/sound';

const STORAGE_NAMES_KEY = 'nhbtn_custom_player_names';

function getStoredPlayerNames(): Record<number, string> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_NAMES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveStoredPlayerName(playerId: number, name: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredPlayerNames();
    current[playerId] = name;
    localStorage.setItem(STORAGE_NAMES_KEY, JSON.stringify(current));
  } catch {}
}

function accumulateTag(prevTag: DeltaTag | null, delta: number, nowTime: number): DeltaTag | null {
  if (prevTag && nowTime - prevTag.timestamp < 3000) {
    const combined = prevTag.amount + delta;
    return { id: `tag-${nowTime}`, amount: combined, timestamp: nowTime };
  }
  return { id: `tag-${nowTime}`, amount: delta, timestamp: nowTime };
}

export function useScorekeeper() {
  const [playerCount, setPlayerCountState] = useState<GameMode>(4);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [tableOrientation, setTableOrientation] = useState<TableOrientation>('standard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cancelAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
    setAutoAdvanceCountdown(null);
  }, []);

  const startAutoAdvance = useCallback(() => {
    cancelAutoAdvance();
    let timeLeft = 5;
    setAutoAdvanceCountdown(timeLeft);

    autoIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft > 0) {
        setAutoAdvanceCountdown(timeLeft);
      } else {
        if (autoIntervalRef.current) {
          clearInterval(autoIntervalRef.current);
          autoIntervalRef.current = null;
        }
      }
    }, 1000);

    autoTimerRef.current = setTimeout(() => {
      cancelAutoAdvance();
      soundCtrl.playVictory();
      const nowStr = new Date().toLocaleTimeString('vi-VN');
      setCurrentRound(prevRound => {
        const nextR = prevRound + 1;
        setHistory(prevHist => [
          {
            id: `${Date.now()}-${Math.random()}`,
            round: prevRound,
            time: nowStr,
            playerName: 'HỆ THỐNG',
            amount: 0,
            newScore: 0,
            reason: `⚡ Tự động chuyển Vòng ${nextR} sau 5s`,
            type: 'round_end'
          },
          ...prevHist
        ]);
        return nextR;
      });
      setManualClickedPlayers([]);
      setPlayers(prev => prev.map(p => ({
        ...p,
        hasInputRound: false,
        isAutoBalanced: false,
        currentRoundDelta: 0,
        activeTag: null
      })));
    }, 5000);
  }, [cancelAutoAdvance]);
  
  const [showBellModal, setShowBellModal] = useState<boolean>(false);
  const [bellActivePlayer, setBellActivePlayer] = useState<Player | null>(null);
  const [showWheelModal, setShowWheelModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  } | null>(null);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const initPlayers = useCallback((count: GameMode): Player[] => {
    const storedNames = getStoredPlayerNames();
    const list: Player[] = [];
    for (let i = 0; i < count; i++) {
      const char = ANIME_CHARACTERS[i % ANIME_CHARACTERS.length];
      const customName = storedNames[i] !== undefined ? storedNames[i] : char.defaultName;
      list.push({
        id: i,
        name: customName,
        title: char.title,
        score: 0,
        charId: char.id,
        hasInputRound: false,
        isAutoBalanced: false,
        currentRoundDelta: 0,
        activeTag: null,
        avatarSvg: char.avatarSvg,
        color: char.color,
        colorLight: char.colorLight,
        colorBorder: char.colorBorder,
        badge: char.badge
      });
    }
    return list;
  }, []);

  const [manualClickedPlayers, setManualClickedPlayers] = useState<number[]>([]);

  useEffect(() => {
    setPlayers(initPlayers(playerCount));
  }, [initPlayers, playerCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPlayers(prev => {
        let hasChanges = false;
        const next = prev.map(p => {
          if (p.activeTag && now - p.activeTag.timestamp >= 3000) {
            hasChanges = true;
            return { ...p, activeTag: null };
          }
          return p;
        });
        return hasChanges ? next : prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const setPlayerCount = (count: GameMode) => {
    if (count === playerCount) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Chuyển Đổi Số Người Chơi',
      message: `Chuyển sang chế độ ${count} người chơi? Ván chơi hiện tại sẽ được làm mới.`,
      confirmText: 'Chuyển Chế Độ',
      cancelText: 'Hủy Bỏ',
      confirmVariant: 'warning',
      onConfirm: () => {
        cancelAutoAdvance();
        setPlayerCountState(count);
        setCurrentRound(1);
        setHistory([]);
        setManualClickedPlayers([]);
        setPlayers(initPlayers(count));
        setConfirmDialog(null);
      }
    });
  };

  const toggleSound = () => {
    const nextState = soundCtrl.toggleSound();
    setSoundEnabled(nextState);
  };

  const toggleTableOrientation = () => {
    setTableOrientation(prev => prev === 'standard' ? 'tabletop' : 'standard');
  };

  const updatePlayerName = (playerId: number, newName: string) => {
    saveStoredPlayerName(playerId, newName);
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, name: newName } : p));
  };

  const addScore = (playerId: number, amount: number, reason: string = '') => {
    soundCtrl.playCoin();
    const nowStr = new Date().toLocaleTimeString('vi-VN');
    const nowTime = Date.now();
    const newLogs: HistoryItem[] = [];

    const nextManualList = manualClickedPlayers.includes(playerId)
      ? manualClickedPlayers
      : [...manualClickedPlayers, playerId];
    setManualClickedPlayers(nextManualList);

    const totalCount = playerCount;
    const neededCount = totalCount - 1;

    setPlayers(prev => {
      let working = prev.map(p => {
        if (p.id === playerId) {
          const nextScore = p.score + amount;
          const nextDelta = p.currentRoundDelta + amount;
          return {
            ...p,
            score: nextScore,
            currentRoundDelta: nextDelta,
            hasInputRound: true,
            activeTag: accumulateTag(p.activeTag, amount, nowTime)
          };
        }
        return p;
      });

      const clickPlayer = working.find(p => p.id === playerId);
      if (clickPlayer) {
        newLogs.push({
          id: `${nowTime}-act-${Math.random()}`,
          round: currentRound,
          time: nowStr,
          playerName: clickPlayer.name,
          amount: amount,
          newScore: clickPlayer.score,
          reason: reason || `${amount > 0 ? '+' : ''}${amount} đ`,
          type: 'score'
        });
      }

      if (nextManualList.length === neededCount) {
        const remainingPlayer = working.find(p => !nextManualList.includes(p.id));

        if (remainingPlayer) {
          const sumOfClicked = working
            .filter(p => nextManualList.includes(p.id))
            .reduce((sum, p) => sum + p.currentRoundDelta, 0);

          const requiredDelta = -sumOfClicked;
          const deltaDiff = requiredDelta - remainingPlayer.currentRoundDelta;

          if (deltaDiff !== 0) {
            working = working.map(p => {
              if (p.id === remainingPlayer.id) {
                return {
                  ...p,
                  score: p.score + deltaDiff,
                  currentRoundDelta: requiredDelta,
                  hasInputRound: true,
                  activeTag: accumulateTag(p.activeTag, deltaDiff, nowTime)
                };
              }
              return p;
            });

            const autoPlayer = working.find(p => p.id === remainingPlayer.id);
            if (autoPlayer) {
              newLogs.push({
                id: `${nowTime}-auto-${Math.random()}`,
                round: currentRound,
                time: nowStr,
                playerName: autoPlayer.name,
                amount: deltaDiff,
                newScore: autoPlayer.score,
                reason: `⚡ Tự động bù trừ (${deltaDiff > 0 ? '+' : ''}${deltaDiff} đ)`,
                type: 'score'
              });
            }
          }
        }

        startAutoAdvance();
      } else {
        cancelAutoAdvance();
      }

      return working;
    });

    if (newLogs.length > 0) {
      setHistory(prev => [...newLogs.reverse(), ...prev]);
    }
  };

  const doAdvanceRound = useCallback(() => {
    soundCtrl.playVictory();
    const nowStr = new Date().toLocaleTimeString('vi-VN');
    const logItem: HistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      round: currentRound,
      time: nowStr,
      playerName: 'HỆ THỐNG',
      amount: 0,
      newScore: 0,
      reason: `Hoàn thành Vòng ${currentRound}`,
      type: 'round_end'
    };
    setHistory(prev => [logItem, ...prev]);
    setCurrentRound(prev => prev + 1);
    setManualClickedPlayers([]);
    setPlayers(prev => prev.map(p => ({
      ...p,
      hasInputRound: false,
      isAutoBalanced: false,
      currentRoundDelta: 0,
      activeTag: null
    })));
    setConfirmDialog(null);
  }, [currentRound]);

  const advanceNextRound = () => {
    cancelAutoAdvance();
    const unsubmitted = players.filter(p => !p.hasInputRound);
    if (unsubmitted.length > 0) {
      const unNames = unsubmitted.map(p => p.name).join(', ');
      setConfirmDialog({
        isOpen: true,
        title: `Chưa Hoàn Tất Vòng ${currentRound}`,
        message: `Còn người chơi (${unNames}) chưa bấm điểm trong vòng ${currentRound}. Bạn vẫn muốn sang vòng mới?`,
        confirmText: 'Sang Vòng Mới',
        cancelText: 'Quay Lại Bấm Điểm',
        confirmVariant: 'warning',
        onConfirm: () => {
          doAdvanceRound();
        }
      });
      return;
    }

    doAdvanceRound();
  };

  const resetGame = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Đặt Lại Ván Chơi',
      message: 'Bạn có chắc chắn muốn đặt lại ván chơi mới? Toàn bộ điểm số và lịch sử các vòng sẽ được xóa.',
      confirmText: 'Đặt Lại',
      cancelText: 'Hủy Bỏ',
      confirmVariant: 'danger',
      onConfirm: () => {
        cancelAutoAdvance();
        setCurrentRound(1);
        setHistory([]);
        setManualClickedPlayers([]);
        setPlayers(initPlayers(playerCount));
        setConfirmDialog(null);
      }
    });
  };

  const triggerBell = (playerId: number) => {
    const target = players.find(p => p.id === playerId);
    if (!target) return;
    setBellActivePlayer(target);
    soundCtrl.playBell();
    setShowBellModal(true);
  };

  const resolveBellSuccess = () => {
    if (!bellActivePlayer) return;
    const pts = playerCount === 4 ? 60 : 80;
    const deductPerOther = 20;
    const ringer = bellActivePlayer;
    soundCtrl.playVictory();
    const nowTime = Date.now();
    const nowStr = new Date().toLocaleTimeString('vi-VN');

    setPlayers(prev => prev.map(p => {
      if (p.id === ringer.id) {
        const nextScore = p.score + pts;
        const nextDelta = p.currentRoundDelta + pts;
        return {
          ...p,
          score: nextScore,
          currentRoundDelta: nextDelta,
          hasInputRound: true,
          activeTag: accumulateTag(p.activeTag, pts, nowTime)
        };
      } else {
        const nextScore = p.score - deductPerOther;
        const nextDelta = p.currentRoundDelta - deductPerOther;
        return {
          ...p,
          score: nextScore,
          currentRoundDelta: nextDelta,
          hasInputRound: true,
          activeTag: accumulateTag(p.activeTag, -deductPerOther, nowTime)
        };
      }
    }));

    setHistory(prev => [
      {
        id: `${nowTime}-bell-${Math.random()}`,
        round: currentRound,
        time: nowStr,
        playerName: ringer.name,
        amount: pts,
        newScore: ringer.score + pts,
        reason: `🔔 Rung chuông THÀNH CÔNG (+${pts} đ)`,
        type: 'bell_success'
      },
      ...prev
    ]);

    setShowBellModal(false);
    setBellActivePlayer(null);
    startAutoAdvance();
  };

  const resolveBellBlock = (blockerId: number) => {
    if (!bellActivePlayer) return;
    const blockerPts = playerCount === 4 ? 80 : 100;
    const ringer = bellActivePlayer;
    const blocker = players.find(p => p.id === blockerId);
    if (!blocker) return;

    soundCtrl.playThud();
    const nowTime = Date.now();
    const nowStr = new Date().toLocaleTimeString('vi-VN');

    setPlayers(prev => prev.map(p => {
      if (p.id === blockerId) {
        const nextScore = p.score + blockerPts;
        const nextDelta = p.currentRoundDelta + blockerPts;
        return {
          ...p,
          score: nextScore,
          currentRoundDelta: nextDelta,
          hasInputRound: true,
          activeTag: accumulateTag(p.activeTag, blockerPts, nowTime)
        };
      }
      if (p.id === ringer.id) {
        const nextScore = p.score - blockerPts;
        const nextDelta = p.currentRoundDelta - blockerPts;
        return {
          ...p,
          score: nextScore,
          currentRoundDelta: nextDelta,
          hasInputRound: true,
          activeTag: accumulateTag(p.activeTag, -blockerPts, nowTime)
        };
      }
      return {
        ...p,
        hasInputRound: true
      };
    }));

    setHistory(prev => [
      {
        id: `${nowTime}-b1-${Math.random()}`,
        round: currentRound,
        time: nowStr,
        playerName: blocker.name,
        amount: blockerPts,
        newScore: blocker.score + blockerPts,
        reason: `🛡️ Chặn chuông của ${ringer.name} (+${blockerPts} đ)`,
        type: 'bell_blocked'
      },
      {
        id: `${nowTime}-b2-${Math.random()}`,
        round: currentRound,
        time: nowStr,
        playerName: ringer.name,
        amount: -blockerPts,
        newScore: ringer.score - blockerPts,
        reason: `🔔 Rung chuông thất bại / Bị ${blocker.name} chặn (-${blockerPts} đ)`,
        type: 'bell_blocked'
      },
      ...prev
    ]);

    setShowBellModal(false);
    setBellActivePlayer(null);
    startAutoAdvance();
  };

  return {
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
  };
}
