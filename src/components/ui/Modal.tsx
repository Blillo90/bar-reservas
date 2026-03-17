'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Responsive overlay:
 * - Mobile  → bottom sheet anchored with left:0 / right:0 / bottom:0
 * - Desktop → centered dialog
 *
 * The panel is positioned with `absolute left-0 right-0 bottom-0` on mobile
 * rather than as a flex child. This means its width is determined directly by
 * CSS inset constraints (viewport width) — no flexbox min-width interference,
 * no w-full percentage ambiguity. It cannot overflow horizontally.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    /* Full-screen overlay — also clips any accidental child overflow */
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        Panel — absolutely positioned, NOT a flex child.

        Mobile (default):
          left:0  right:0  bottom:0
          → width is forced to viewport width by CSS inset constraints.
          No flex, no w-full, no min-width involved.

        Desktop (sm+):
          inset-auto resets all sides, then left:50% + -translate-x-1/2
          + top:50% + -translate-y-1/2 centres the dialog.
          max-w-lg caps width at 32rem.
      */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="
          absolute bottom-0 left-0 right-0
          sm:inset-auto sm:top-1/2 sm:left-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2
          sm:w-full sm:max-w-lg
          bg-white dark:bg-slate-800
          border-t border-slate-200 dark:border-slate-700
          sm:border sm:rounded-2xl
          rounded-t-2xl
          shadow-2xl
          max-h-[92vh] flex flex-col
        "
        style={{ animation: 'slide-up 0.22s ease-out both' }}
      >
        {/* Handle bar — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-slate-900 dark:text-white font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body — vertical scroll only */}
        <div className="overflow-y-auto overflow-x-hidden flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
