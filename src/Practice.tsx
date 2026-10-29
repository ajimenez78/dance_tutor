import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Style } from "./lessons";
import { useLanguage } from "./i18n";

export default function Practice({ style }: { style: Style }) {
  const { t } = useLanguage();
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const [beat, setBeat] = useState(0);
  const [tempo, setTempo] = useState(80);

  useEffect(() => {
    if (!running) return;
    const end = Date.now() + remaining * 1000;
    const timer = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) setRunning(false);
    }, 200);
    return () => window.clearInterval(timer);
    // Remaining is captured at start/resume; the deadline must not reset on each tick.
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setBeat((value) => (value + 1) % 8),
      60_000 / tempo,
    );
    return () => window.clearInterval(timer);
  }, [running, tempo]);

  const accent = beat === 3 || beat === 7;
  function reset() {
    setRunning(false);
    setRemaining(60);
    setBeat(0);
  }

  return (
    <div className="practice-box">
      <div className="practice-top">
        <span className="eyebrow">{t("YOUR ONE-MINUTE PRACTICE")}</span>
        <span
          className="timer"
          role="timer"
          aria-label={t("Practice time remaining")}
        >
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="beat-display" aria-hidden="true">
        <span className={accent ? "accent-beat" : ""}>{beat + 1}</span>
        <small>
          {accent ? (style === "salsa" ? t("hold") : t("tap")) : t("step")}
        </small>
      </div>
      <div
        className="beat-row"
        role="img"
        aria-label={
          style === "salsa"
            ? t("Step on 1, 2, 3, 5, 6, 7; hold on 4 and 8")
            : t("Step on 1, 2, 3, 5, 6, 7; tap on 4 and 8")
        }
      >
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className={`${i === beat ? "current" : ""} ${i === 3 || i === 7 ? "hold" : ""}`}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <p className="practice-status" role="status">
        {remaining === 0
          ? t("One minute, well spent. Repeat or continue when you’re ready.")
          : running
            ? t("Follow the count. Small steps, soft knees.")
            : t("A visual count to help you settle into the rhythm.")}
      </p>
      <label className="tempo-label" htmlFor="tempo">
        {t("Practice tempo")}
        <span>{tempo} BPM</span>
      </label>
      <input
        id="tempo"
        type="range"
        min="60"
        max="120"
        step="5"
        value={tempo}
        onChange={(event) => setTempo(Number(event.target.value))}
      />
      <div className="practice-controls">
        <button
          className="button primary"
          onClick={() => {
            if (remaining === 0) {
              setRemaining(60);
              setBeat(0);
            }
            setRunning(!running);
          }}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running
            ? t("Pause practice")
            : remaining === 0
              ? t("Practice again")
              : remaining === 60
                ? t("Start practice")
                : t("Resume practice")}
        </button>
        <button
          className="icon-button"
          onClick={reset}
          aria-label={t("Reset practice")}
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
