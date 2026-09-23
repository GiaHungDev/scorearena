'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface DockPosition {
  x: number;
  y: number;
}

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
  const [position, setPosition] = useState<DockPosition | null>(null);
  const dockRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);

  const clampPosition = useCallback((next: DockPosition): DockPosition => {
    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return next;
    const viewport = window.visualViewport;
    const left = (viewport?.offsetLeft ?? 0) + 8;
    const top = (viewport?.offsetTop ?? 0) + 8;
    return {
      x: Math.max(left, Math.min(next.x, left + (viewport?.width ?? window.innerWidth) - rect.width - 16)),
      y: Math.max(top, Math.min(next.y, top + (viewport?.height ?? window.innerHeight) - rect.height - 16))
    };
  }, []);

  useEffect(() => {
    const keepInViewport = () => setPosition(prev => prev ? clampPosition(prev) : prev);
    const observer = new ResizeObserver(keepInViewport);
    if (dockRef.current) observer.observe(dockRef.current);
    window.addEventListener('resize', keepInViewport);
    window.visualViewport?.addEventListener('resize', keepInViewport);
    window.visualViewport?.addEventListener('scroll', keepInViewport);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', keepInViewport);
      window.visualViewport?.removeEventListener('resize', keepInViewport);
      window.visualViewport?.removeEventListener('scroll', keepInViewport);
    };
  }, [clampPosition, isMinimized]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition(clampPosition({ x: event.clientX - drag.offsetX, y: event.clientY - drag.offsetY }));
  };

  const stopDragging = () => { dragRef.current = null; };
  const handleMoveKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]
    };
    const direction = directions[event.key];
    const rect = dockRef.current?.getBoundingClientRect();
    if (!direction || !rect) return;
    event.preventDefault();
    const step = event.shiftKey ? 40 : 10;
    setPosition(clampPosition({ x: rect.left + direction[0] * step, y: rect.top + direction[1] * step }));
  };

  const dragHandleProps = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: stopDragging,
    onPointerCancel: stopDragging,
    onLostPointerCapture: stopDragging,
    onKeyDown: handleMoveKey,
    title: 'Kéo để di chuyển bảng vòng (hoặc dùng phím mũi tên)',
    'aria-label': 'Di chuyển bảng vòng'
  };
  const dockStyle: React.CSSProperties | undefined = position
    ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
    : undefined;
  const isAllSubmitted = submittedCount === totalPlayers;
  const progressPercent = (submittedCount / totalPlayers) * 100;
  const isCountingDown = typeof autoAdvanceCountdown === 'number' && autoAdvanceCountdown > 0;

  if (isMinimized) {
    return (
      <aside ref={dockRef} className="round-corner-dock minimized" style={dockStyle} aria-label="Bảng điều khiển vòng chơi">
        <button type="button" className="dock-drag-handle dock-min-badge" {...dragHandleProps}>V{currentRound}</button>
        <div className="dock-min-status">
          {isCountingDown ? `⏱️ ${autoAdvanceCountdown}s` : `${submittedCount}/${totalPlayers}`}
        </div>
        <button type="button" className="btn-dock-minimize dock-expand-icon" onClick={() => setIsMinimized(false)} title="Mở rộng bảng điều khiển" aria-label="Mở rộng bảng điều khiển">🔼</button>
      </aside>
    );
  }

  return (
    <aside ref={dockRef} className="round-corner-dock" style={dockStyle} aria-label="Bảng điều khiển vòng chơi">
      <div className="dock-header">
        <button type="button" className="dock-round-tag dock-drag-handle" {...dragHandleProps}>
          <span className="dock-round-icon">🏆</span>
          <span className="dock-round-title">VÒNG {currentRound}</span>
        </button>
        <button
          className="btn-dock-minimize"
          onClick={() => setIsMinimized(true)}
          title="Thu nhỏ bảng điều khiển"
          aria-label="Thu nhỏ bảng điều khiển"
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
