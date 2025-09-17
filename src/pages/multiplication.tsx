import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/style.css";
import "@/styles/multiplicationstyle.css";
import { Navbar } from "@/components/navbar";

type Mode = "wrong" | "slow" | "mixed";

interface Fact {
    id: number;
    a: number;
    b: number;
    product: number;
    attempts: number;
    correct: number;
    last_correct: 0 | 1 | null;
    sum_ms: number;
    best_ms: number | null;
}

interface DB { facts: Fact[]; }

interface Stat {
    id: number;
    a: number;
    b: number;
    product: number;
    attempts: number;
    correct: number;
    ever_correct: 0 | 1;
    avg_ms: number | null;
    best_ms: number | null;
    last_correct: 0 | 1 | null;
}

// -----------------------------
// Persistence
// -----------------------------
const DB_KEY = "times_tables_db_v1";

function seedFacts(): DB {
    const facts: Fact[] = [];
    let id = 1;
    for (let a = 1; a <= 12; a++) {
        for (let b = 1; b <= 12; b++) {
            facts.push({
                id: id++,
                a,
                b,
                product: a * b,
                attempts: 0,
                correct: 0,
                last_correct: null,
                sum_ms: 0,
                best_ms: null,
            });
        }
    }
    return { facts };
}

function loadDB(): DB {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
        const seeded = seedFacts();
        localStorage.setItem(DB_KEY, JSON.stringify(seeded));
        return seeded;
    }
    try {
        return JSON.parse(raw) as DB;
    } catch {
        const seeded = seedFacts();
        localStorage.setItem(DB_KEY, JSON.stringify(seeded));
        return seeded;
    }
}

function saveDB(db: DB): void {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function resetAttempts(): void {
    const db = loadDB();
    for (const f of db.facts) {
        f.attempts = 0;
        f.correct = 0;
        f.last_correct = null;
        f.sum_ms = 0;
        f.best_ms = null;
    }
    saveDB(db);
}

function initDB(): void {
    const db = seedFacts();
    saveDB(db);
}

function avgMs(f: Fact): number | null {
    return f.attempts ? Math.round(f.sum_ms / f.attempts) : null;
}

function fetchStats(): Stat[] {
    const db = loadDB();
    return db.facts.map((f) => ({
        id: f.id,
        a: f.a,
        b: f.b,
        product: f.product,
        attempts: f.attempts,
        correct: f.correct,
        ever_correct: f.correct > 0 ? 1 : 0,
        avg_ms: avgMs(f),
        best_ms: f.best_ms,
        last_correct: f.last_correct,
    }));
}

function recordAttempt(factId: number, isCorrect: boolean, elapsedMs: number): void {
    const db = loadDB();
    const f = db.facts.find((x) => x.id === factId);
    if (!f) return;
    f.attempts += 1;
    if (isCorrect) f.correct += 1;
    f.last_correct = isCorrect ? 1 : 0;
    const clipped = Math.max(0, Math.floor(elapsedMs));
    f.sum_ms += clipped;
    if (f.best_ms === null || clipped < f.best_ms) {
        f.best_ms = clipped;
    }
    saveDB(db);
}

function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function chooseQuestions(mode: Mode, count?: number): Stat[] {
    const stats = fetchStats();
    const copy = <T,>(s: T) => JSON.parse(JSON.stringify(s)) as T;

    if (mode === "wrong") {
        const pool = stats.filter((s) => s.last_correct === 0 || s.last_correct === null);
        shuffle(pool);
        return pool.slice(0, count || pool.length).map(copy);
    } else if (mode === "slow") {
        const withAvg = stats.filter((s) => s.avg_ms !== null).sort((a, b) => b.avg_ms! - a.avg_ms!);
        const noAvg = stats.filter((s) => s.avg_ms === null);
        const pool = withAvg.concat(noAvg);
        return pool.slice(0, count || pool.length).map(copy);
    } else if (mode === "mixed") {
        const wrong = stats.filter((s) => s.last_correct === 0 || s.last_correct === null);
        shuffle(wrong);
        const withAvg = stats.filter((s) => s.avg_ms !== null).sort((a, b) => b.avg_ms! - a.avg_ms!);
        const noAvg = stats.filter((s) => s.avg_ms === null);
        const slow = withAvg.concat(noAvg);
        const selected: Stat[] = [];
        const seen = new Set<number>();
        const half = count ? Math.floor(count / 2) : 24;
        for (const s of wrong.slice(0, half)) {
            if (!seen.has(s.id)) { selected.push(s); seen.add(s.id); }
        }
        const target = count || 48;
        for (const s of slow) {
            if (selected.length >= target) break;
            if (!seen.has(s.id)) { selected.push(s); seen.add(s.id); }
        }
        return selected.map(copy);
    }
    return [];
}

// -----------------------------
// React UI
// -----------------------------
function App() {
    const [mode, setMode] = useState<Mode>("mixed");
    const [count, setCount] = useState<number>(24);

    const [currentQuestions, setCurrentQuestions] = useState<Stat[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [answer, setAnswer] = useState<string>("");
    const [feedback, setFeedback] = useState<{ text: string; ok?: boolean }>({ text: "" });
    const [log, setLog] = useState<string>("Welcome! Click Start Quiz or Stats to begin.\n");
    const [sessionTimes, setSessionTimes] = useState<number[]>([]);
    const [sessionCorrect, setSessionCorrect] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const logRef = useRef<HTMLDivElement | null>(null);
    const startTickRef = useRef<number | null>(null);

    useEffect(() => {
        document.title = "Multiplication Practice — Rexford Dorchester";
        loadDB();
    }, []);

    // Scroll shadow for navbar: toggles 'scrolled' on <html>
    useEffect(() => {
        const onScroll = () => {
            document.documentElement.classList.toggle("scrolled", window.scrollY > 2);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Keep log scrolled to bottom when it changes
    useEffect(() => {
        const el = logRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [log]);

    const prompt = useMemo(() => {
        if (currentIndex < 0 || currentIndex >= currentQuestions.length) return "Press “Start Quiz” to begin";
        const q = currentQuestions[currentIndex];
        return `${q.a} × ${q.b} =`;
    }, [currentIndex, currentQuestions]);

    const summary = useMemo(() => {
        if (sessionTimes.length === 0) return "Session: 0/0 correct | Avg: – ms | Best: – ms | Slowest: – ms";
        const avg = Math.round(sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length);
        const best = Math.min(...sessionTimes);
        const worst = Math.max(...sessionTimes);
        return `Session: ${sessionCorrect}/${sessionTimes.length} correct | Avg: ${avg} ms | Best: ${best} ms | Slowest: ${worst} ms`;
    }, [sessionTimes, sessionCorrect]);

    function appendLog(line: string, clear = false) {
        setLog((prev) => (clear ? "" : prev) + (line.endsWith("\n") ? line : line + "\n"));
    }

    function nextQuestion() {
        setCurrentIndex((idx) => {
            const next = idx + 1;
            if (next >= currentQuestions.length) {
                setFeedback({ text: "" });
                return next;
            }
            setAnswer("");
            startTickRef.current = performance.now();
            setTimeout(() => inputRef.current?.focus(), 0);
            return next;
        });
    }

    function startQuiz() {
        const safeCount = Number.isFinite(count) && count > 0 ? count : 24;
        const qs = chooseQuestions(mode, safeCount);
        if (!qs.length) {
            window.alert('No questions found for this mode. Try "slow" or "mixed" after a few attempts.');
            return;
        }
        setCurrentQuestions(qs);
        setCurrentIndex(-1);
        setSessionTimes([]);
        setSessionCorrect(0);
        appendLog(`Mode: ${mode} | Questions: ${qs.length}`, true);
        setFeedback({ text: "" });
        setTimeout(nextQuestion, 0);
    }

    function submitAnswer() {
        if (currentIndex < 0 || currentIndex >= currentQuestions.length) return;
        const q = currentQuestions[currentIndex];
        const userRaw = (answer || "").trim();
        const user = Number(userRaw);
        const elapsed = Math.max(0, Math.round(performance.now() - (startTickRef.current ?? performance.now())));

        const isCorrect = Number.isFinite(user) && user === q.product;

        recordAttempt(q.id, isCorrect, elapsed);

        setSessionTimes((prev) => [...prev, elapsed]);
        if (isCorrect) {
            setFeedback({ text: `✅ Correct (${elapsed} ms)`, ok: true });
            setSessionCorrect((c) => c + 1);
            appendLog(`${q.a} × ${q.b} = ${q.product}  ✓ ${elapsed} ms`);
        } else {
            setFeedback({ text: `❌ ${q.a} × ${q.b} = ${q.product} (you: ${userRaw || "∅"}) [${elapsed} ms]`, ok: false });
            appendLog(`${q.a} × ${q.b} = ${q.product}  ✗ you: ${JSON.stringify(userRaw)}  ${elapsed} ms`);
        }

        setTimeout(nextQuestion, 120);
    }

    function minStat(list: Stat[], key: keyof Pick<Stat, "best_ms" | "avg_ms">): number | "–" {
        const vals = list.map((s) => s[key]).filter((v): v is number => typeof v === "number");
        return vals.length ? Math.min(...vals) : "–";
    }

    function maxStat(list: Stat[], key: keyof Pick<Stat, "best_ms" | "avg_ms">): number | "–" {
        const vals = list.map((s) => s[key]).filter((v): v is number => typeof v === "number");
        return vals.length ? Math.max(...vals) : "–";
    }

    function buildStatsText(): string {
        const stats = fetchStats();
        const total = stats.length;
        const attempted = stats.filter((s) => s.attempts > 0).length;
        const mastered = stats.filter((s) => s.ever_correct === 1).length;
        const allTimes: number[] = [];

        for (const s of stats) {
            if (s.avg_ms !== null) allTimes.push(s.avg_ms);
        }

        const lines: string[] = [];
        lines.push("=== Overall Stats ===");
        lines.push(`Facts total: ${total}`);
        lines.push(`Attempted : ${attempted}`);
        lines.push(`Ever correct on: ${mastered}`);

        if (allTimes.length) {
            const overallAvg = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length);
            lines.push(`Overall avg time: ${overallAvg} ms | Best: ${minStat(stats, "best_ms")} ms | Slowest: ${maxStat(stats, "avg_ms")} ms`);
        } else {
            lines.push("No timing yet.");
        }

        const withAvg = stats.filter((s) => s.avg_ms !== null).sort((a, b) => b.avg_ms! - a.avg_ms!).slice(0, 10);

        lines.push("\n=== Slowest 10 (by average ms) ===");
        if (!withAvg.length) {
            lines.push("No attempts yet.");
        } else {
            for (const s of withAvg) {
                const last = s.last_correct === 1 ? "✔" : s.last_correct === 0 ? "✖" : "-";
                lines.push(`${s.a} x ${s.b}: avg ${s.avg_ms} ms | best ${s.best_ms ?? "–"} ms | attempts ${s.attempts} | last ${last}`);
            }
        }

        const missed = stats.filter((s) => s.last_correct === 0 || s.last_correct === null);
        lines.push(`\nNeed work (last wrong or never tried): ${missed.length}`);
        if (missed.length) {
            const preview = missed.slice(0, 20).map((m) => `${m.a}×${m.b}`).join(", ");
            lines.push(`  e.g., ${preview}${missed.length > 20 ? "…" : ""}`);
        }

        return lines.join("\n") + "\n";
    }

    const atEnd = currentIndex >= currentQuestions.length && currentQuestions.length > 0;

    return (
        <div className="app page-multiplication">
            <Navbar />

            <div className="futuristic-bg" aria-hidden="true" />

            <main id="content" className="page">
                <header className="page-header">
                    <h1 className="page-title glow">Times Tables Trainer (1–12)</h1>
                    <p className="page-subtitle">Speed + accuracy tracker with persistent stats (localStorage).</p>
                </header>

                <div className="card">
                    <div className="row" role="group" aria-label="Controls">
                        <label htmlFor="mode">Mode</label>
                        <select id="mode" aria-label="Mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                            <option value="mixed">mixed</option>
                            <option value="wrong">wrong</option>
                            <option value="slow">slow</option>
                        </select>

                        <label htmlFor="count">Count</label>
                        <input
                            id="count"
                            type="number"
                            min={1}
                            max={144}
                            value={count}
                            onChange={(e) => setCount(Math.max(1, Math.min(144, Number(e.target.value) || 1)))}
                        />

                        <button className="btn" onClick={startQuiz} id="startBtn">Start Quiz</button>
                        <button className="btn btn--ghost" onClick={() => appendLog(buildStatsText(), true)} id="statsBtn">Stats</button>
                        <button
                            className="btn btn--ghost"
                            title="Initialize or re-seed the local database"
                            onClick={() => { if (window.confirm("Initialize DB? This reseeds facts and clears attempts.")) { initDB(); window.alert("Initialized."); } }}
                            id="initBtn"
                        >
                            Init DB
                        </button>
                        <button
                            className="btn btn--ghost"
                            title="Clear attempts but keep facts"
                            onClick={() => { if (window.confirm("Clear all attempts (keep facts)?")) { resetAttempts(); window.alert("Attempts cleared."); } }}
                            id="resetBtn"
                        >
                            Reset Attempts
                        </button>

                        <span className="chip" id="persistenceInfo" title="Storage backend">Storage: localStorage</span>
                    </div>

                    <div className="prompt" id="prompt">
                        {atEnd ? "Done! Start another quiz or check stats." : prompt}
                    </div>

                    <div className="answer-row">
                        <label htmlFor="answer">Answer</label>
                        <input
                            id="answer"
                            type="number"
                            inputMode="numeric"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") submitAnswer(); }}
                            ref={inputRef}
                        />
                        <button className="btn" id="submitBtn" onClick={submitAnswer}>Submit</button>
                    </div>

                    <div id="feedback" className={`feedback ${feedback.text ? (feedback.ok ? "ok" : "bad") : ""}`} aria-live="polite">
                        {feedback.text}
                    </div>

                    <div id="summary" className="summary">{summary}</div>

                    <div className="spacer" />

                    <div id="log" className="textbox" aria-live="polite" ref={logRef}>
                        {log}
                    </div>
                </div>

                <p className="muted" style={{ marginTop: 10 }}>
                    All data is stored locally in your browser.
                </p>
            </main>
        </div>
    );
}

// Mount
const mountEl = document.getElementById("app");
if (mountEl) {
    createRoot(mountEl).render(<App />);
}
