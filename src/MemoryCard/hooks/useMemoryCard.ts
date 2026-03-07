import { useState, useEffect, useRef, useCallback } from 'react';
import type { CardDef, CardInstance, GamePhase } from '../types';
import { resumeAudio, playFlipSound, playMatchSound, playMismatchSound, playWinSound } from '../utils/sounds';

const FLIP_BACK_DELAY = 900; // ms before mismatched cards flip back
const STORAGE_KEY = 'mc_best';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDefs(pool: CardDef[], n: number): CardDef[] {
  return shuffle(pool).slice(0, n);
}

function buildDeck(defs: CardDef[]): CardInstance[] {
  // Each def appears twice (a pair)
  const doubled = [...defs, ...defs];
  return shuffle(doubled).map((def, i) => ({
    instanceId: i,
    def,
    isFlipped: false,
    isMatched: false,
  }));
}

function loadBest(): { moves: number; time: number } | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function saveBest(moves: number, time: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ moves, time }));
}

export function useMemoryCard(pool: CardDef[], defsPerGame = 6) {
  const defsRef = useRef<CardDef[]>(pickDefs(pool, defsPerGame));
  const [cards, setCards] = useState<CardInstance[]>(() => buildDeck(defsRef.current));
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState<{ moves: number; time: number } | null>(loadBest);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // indices of currently face-up unmatched cards
  const flippedRef = useRef<number[]>([]);
  const lockRef = useRef(false); // prevent clicks during flip-back animation
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const startGame = useCallback(() => {
    resumeAudio();
    defsRef.current = pickDefs(pool, defsPerGame);
    flippedRef.current = [];
    lockRef.current = false;
    setCards(buildDeck(defsRef.current));
    setMoves(0);
    setTime(0);
    setIsNewRecord(false);
    setPhase('playing');
  }, [pool, defsPerGame]);

  const resetGame = useCallback(() => {
    flippedRef.current = [];
    lockRef.current = false;
    setCards(buildDeck(defsRef.current));
    setMoves(0);
    setTime(0);
    setIsNewRecord(false);
    setPhase('idle');
  }, []);

  const flipCard = useCallback((instanceId: number) => {
    if (phase !== 'playing') return;
    if (lockRef.current) return;

    setCards((prev) => {
      const card = prev[instanceId];
      // ignore already flipped or matched
      if (card.isFlipped || card.isMatched) return prev;
      if (flippedRef.current.length >= 2) return prev;

      playFlipSound();

      const next = prev.map((c) =>
        c.instanceId === instanceId ? { ...c, isFlipped: true } : c
      );

      const flipped = [...flippedRef.current, instanceId];
      flippedRef.current = flipped;

      if (flipped.length === 2) {
        const [a, b] = flipped.map((id) => next[id]);
        setMoves((m) => m + 1);

        if (a.def.id === b.def.id) {
          // Match!
          const matched = next.map((c) =>
            c.instanceId === a.instanceId || c.instanceId === b.instanceId
              ? { ...c, isMatched: true }
              : c
          );
          flippedRef.current = [];

          // Check win
          const allMatched = matched.every((c) => c.isMatched);
          if (allMatched) {
            playWinSound();
            setPhase('won');
            setMoves((m) => {
              const finalMoves = m; // already incremented above
              setTime((t) => {
                const prev = loadBest();
                const isNew = !prev || finalMoves < prev.moves || (finalMoves === prev.moves && t < prev.time);
                if (isNew) {
                  saveBest(finalMoves, t);
                  setBest({ moves: finalMoves, time: t });
                  setIsNewRecord(true);
                }
                return t;
              });
              return m;
            });
          }
          if (!allMatched) playMatchSound();
          return matched;
        } else {
          // No match — flip back after delay
          playMismatchSound();
          lockRef.current = true;
          setTimeout(() => {
            flippedRef.current = [];
            lockRef.current = false;
            setCards((c) =>
              c.map((card) =>
                card.instanceId === a.instanceId || card.instanceId === b.instanceId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
          }, FLIP_BACK_DELAY);
        }
      }

      return next;
    });
  }, [phase]);

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  return { cards, phase, moves, time, best, isNewRecord, matchedCount, totalPairs: defsRef.current.length, startGame, resetGame, flipCard };
}
