/**
 * Pure logic for Fruidle game
 * No DOM references here → safe for Vitest
 */

// =========================
//   WORDLE-STYLE SCORING
// =========================
//
// This version correctly handles "duplicate fruit" situations.
// It matches Wordle behavior exactly:
// 1. Mark greens (correct spot).
// 2. Mark yellows based on remaining unused fruit counts.
// 3. No double-yellow mistakes.

export function checkGuess(guess, secret) {
    const size = secret.length;
    const res = Array(size).fill("absent");

    // Count occurrences of each fruit in the secret
    const counts = {};
    for (let i = 0; i < size; i++) {
        const s = secret[i];
        counts[s] = (counts[s] || 0) + 1;
    }

    // PASS 1 — mark green
    for (let i = 0; i < size; i++) {
        if (guess[i] === secret[i]) {
            res[i] = "correct";
            counts[guess[i]]--;
        }
    }

    // PASS 2 — mark yellow
    for (let i = 0; i < size; i++) {
        if (res[i] === "correct") continue;

        const g = guess[i];
        if (counts[g] > 0) {
            res[i] = "present";
            counts[g]--;
        }
    }

    return res;
}

// ==========================
//   SECRET GENERATION
// ==========================
export function makeSecret(list, size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        const r = Math.floor(Math.random() * list.length);
        arr.push(list[r]);
    }
    return arr;
}

// ==================================
//   HIGH SCORE MANAGER (PURE LOGIC)
// ==================================
export const HighScoreManager = {
    STORAGE_KEY: 'fruidle_high_score',

    getHighScore() {
        const saved = sessionStorage.getItem(this.STORAGE_KEY);
        if (saved) return parseInt(saved, 10);
        return 0;
    },

    updateHighScore(level) {
        const currentHigh = this.getHighScore();
        if (level > currentHigh) {
            sessionStorage.setItem(this.STORAGE_KEY, level.toString());
            return true;
        }
        return false;
    },

    formatHighScore() {
        const level = this.getHighScore();
        if (level === 0) return "None";
        return `Level ${level}`;
    }
};
