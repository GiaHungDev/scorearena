'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác Nhận',
  cancelText = 'Hủy Bỏ',
  confirmVariant = 'warning',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const iconBadge = confirmVariant === 'danger' ? '🚨' : confirmVariant === 'primary' ? 'ℹ️' : '⚠️';

  return (
    <AnimatePresence>
      <div className="modal-overlay active" onClick={onCancel} style={{ zIndex: 1100 }}>
        <motion.div
          className={`confirm-modal-card confirm-variant-${confirmVariant}`}
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        >
          {/* Header */}
          <div className="confirm-modal-header">
            <div className="confirm-icon-badge">{iconBadge}</div>
            <h3 className="confirm-modal-title">{title}</h3>
            <button className="btn-modal-close" onClick={onCancel} title="Đóng" aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Body Message */}
          <div className="confirm-modal-body">
            <p className="confirm-modal-text">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="confirm-modal-actions">
            <button
              type="button"
              className="btn-confirm-cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className={`btn-confirm-action btn-confirm-${confirmVariant}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
