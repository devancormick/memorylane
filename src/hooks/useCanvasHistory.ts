'use client';

import { useState, useCallback } from 'react';
import { CanvasData, CanvasHistoryState } from '@/lib/canvas/types';

const MAX_HISTORY_SIZE = 50;

export function useCanvasHistory(initialData: CanvasData) {
  const [history, setHistory] = useState<CanvasHistoryState>({
    past: [],
    present: initialData,
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const saveState = useCallback((newState: CanvasData) => {
    setHistory(prev => ({
      past: [...prev.past.slice(-MAX_HISTORY_SIZE + 1), prev.present],
      present: newState,
      future: []
    }));
  }, []);

  const undo = useCallback(() => {
    if (!canUndo) return null;

    setHistory(prev => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });

    return history.past[history.past.length - 1];
  }, [canUndo, history.past]);

  const redo = useCallback(() => {
    if (!canRedo) return null;

    setHistory(prev => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });

    return history.future[0];
  }, [canRedo, history.future]);

  const reset = useCallback((newData: CanvasData) => {
    setHistory({
      past: [],
      present: newData,
      future: []
    });
  }, []);

  return {
    currentState: history.present,
    canUndo,
    canRedo,
    saveState,
    undo,
    redo,
    reset
  };
}