import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkGuess, makeSecret, HighScoreManager } from './fruidleLogic.js';
const store = {};
global.sessionStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v; },
  clear: () => { for (const k in store) delete store[k]; }
};

describe('Fruidle Game Logic', () => {

  describe('checkGuess', () => {
    it('marks all correct when guess matches secret exactly', () => {
      const secret = ['apple.png','banana.png','kiwi.png'];
      const guess = ['apple.png','banana.png','kiwi.png'];
      expect(checkGuess(guess, secret)).toEqual(['correct','correct','correct']);
    });

    it('marks absent when guess fruits are not in secret', () => {
      const secret = ['apple.png','banana.png','kiwi.png'];
      const guess = ['pear.png','melon.png','grape.png'];
      expect(checkGuess(guess, secret)).toEqual(['absent','absent','absent']);
    });

    it('marks present when guess fruits are in secret but wrong spot', () => {
      const secret = ['apple.png','banana.png','kiwi.png'];
      const guess = ['banana.png','kiwi.png','apple.png'];
      expect(checkGuess(guess, secret)).toEqual(['present','present','present']);
    });

    it('handles mixed correct, present, and absent', () => {
      const secret = ['apple.png','banana.png','kiwi.png'];
      const guess = ['apple.png','kiwi.png','grape.png'];
      expect(checkGuess(guess, secret)).toEqual(['correct','present','absent']);
    });

    it('prevents double yellow', () => {
      const secret = ['apple.png','banana.png','kiwi.png'];
      const guess = ['kiwi.png','kiwi.png','kiwi.png'];
      expect(checkGuess(guess, secret)).toEqual(['absent','absent','correct']);
    });
  });

  describe('makeSecret', () => {
    it('generates a sequence of the correct length', () => {
      const pool = ['apple.png','banana.png','kiwi.png'];
      const secret = makeSecret(pool, 3);
      expect(secret.length).toBe(3);
    });

    it('generates a sequence using only allowed fruits', () => {
      const pool = ['apple.png','banana.png','kiwi.png'];
      const secret = makeSecret(pool, 5);
      expect(secret.every(fruit => pool.includes(fruit))).toBe(true);
    });
  });

  describe('HighScoreManager', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('getHighScore returns 0 if none saved', () => {
      expect(HighScoreManager.getHighScore()).toBe(0);
    });

    it('updateHighScore updates only if new level is higher', () => {
      expect(HighScoreManager.updateHighScore(2)).toBe(true);
      expect(HighScoreManager.getHighScore()).toBe(2);

      expect(HighScoreManager.updateHighScore(1)).toBe(false);
      expect(HighScoreManager.getHighScore()).toBe(2);
    });

    it('formatHighScore formats correctly', () => {
      expect(HighScoreManager.formatHighScore()).toBe('None');
      HighScoreManager.updateHighScore(3);
      expect(HighScoreManager.formatHighScore()).toBe('Level 3');
    });
  });
});
