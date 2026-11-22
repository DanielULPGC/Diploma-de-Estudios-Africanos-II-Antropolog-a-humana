import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { INTRO_NARRATED_SCENES } from '../../data/deaPedagogyData';

const TOTAL_MS = 120000;

function formatTime(ms: number): string {
  const sec = Math.max(0, Math.min(120, Math.floor(ms / 1000)));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function AtlasNarratedIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [subsOn, setSubsOn] = useState(true);

  const rafRef = useRef<number | null>(null);
  const baseTimeRef = useRef<number>(0);
  const currentMsRef = useRef<number>(0);
  const voiceOnRef = useRef<boolean>(voiceOn);
  const spokenRef = useRef<Set<number>>(new Set());

  voiceOnRef.current = voiceOn;

  const supportsSpeech =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const activeSceneIdx = Math.max(
    0,
    INTRO_NARRATED_SCENES.findIndex((s) => currentMs < s.endMs) === -1
      ? INTRO_NARRATED_SCENES.length - 1
      : INTRO_NARRATED_SCENES.findIndex((s) => currentMs < s.endMs)
  );
  const activeScene = INTRO_NARRATED_SCENES[activeSceneIdx];

  const activeSubtitle =
    activeScene.subtitulos.find((sub) => currentMs >= sub.t0 && currentMs < sub.t1)?.txt ??
    activeScene.subtitulos[activeScene.subtitulos.length - 1]?.txt ??
    '';

  const speakText = (text: string, forceVoice = false) => {
    if (!supportsSpeech || (!voiceOnRef.current && !forceVoice)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const esVoice =
        voices.find((v) => /^es-ES/i.test(v.lang)) ??
        voices.find((v) => /^es/i.test(v.lang)) ??
        null;
      if (esVoice) utterance.voice = esVoice;
      utterance.lang = esVoice?.lang ?? 'es-ES';
      utterance.rate = 0.96;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis optional fallback
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }

    baseTimeRef.current = performance.now() - currentMsRef.current;

    const tick = (now: number) => {
      const elapsed = now - baseTimeRef.current;
      if (elapsed >= TOTAL_MS) {
        currentMsRef.current = TOTAL_MS;
        setCurrentMs(TOTAL_MS);
        setIsPlaying(false);
        return;
      }
      currentMsRef.current = elapsed;
      setCurrentMs(elapsed);

      const idx = INTRO_NARRATED_SCENES.findIndex((s) => elapsed < s.endMs);
      const safeIdx = idx === -1 ? INTRO_NARRATED_SCENES.length - 1 : idx;
      if (!spokenRef.current.has(safeIdx)) {
        spokenRef.current.add(safeIdx);
        speakText(INTRO_NARRATED_SCENES[safeIdx].narracion);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (supportsSpeech) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [supportsSpeech]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (supportsSpeech) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    } else {
      if (currentMsRef.current >= TOTAL_MS) {
        currentMsRef.current = 0;
        setCurrentMs(0);
        spokenRef.current.clear();
      }
      setIsPlaying(true);
    }
  };

  const jumpToScene = (idx: number) => {
    const clamped = Math.max(0, Math.min(INTRO_NARRATED_SCENES.length - 1, idx));
    const scene = INTRO_NARRATED_SCENES[clamped];
    spokenRef.current.clear();
    for (let i = 0; i < clamped; i++) spokenRef.current.add(i);
    currentMsRef.current = scene.startMs;
    setCurrentMs(scene.startMs);
    if (isPlaying) {
      baseTimeRef.current = performance.now() - scene.startMs;
      spokenRef.current.add(clamped);
      speakText(scene.narracion);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    currentMsRef.current = 0;
    setCurrentMs(0);
    spokenRef.current.clear();
    if (supportsSpeech) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  };

  const pct = Math.min(100, (currentMs / TOTAL_MS) * 100);

  return (
    <div className="bg-paper border-t border-rule border-b border-b-hairline">
      <button
        type="button"
        onClick={() => {
          if (isOpen && isPlaying) {
            setIsPlaying(false);
            if (supportsSpeech) {
              try {
                window.speechSynthesis.cancel();
              } catch {
                // ignore
              }
            }
          }
          setIsOpen((o) => !o);
        }}
        aria-expanded={isOpen}
        className="w-full px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-left cursor-pointer hover:bg-surface/60 transition-colors"
      >
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="font-mono text-xs font-medium text-ochre">
            Introducción narrada · 2:00 min
          </span>
          <span className="font-display text-base font-semibold text-ink">
            Paleoantropología: una introducción a la materia (8 escenas)
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted whitespace-nowrap">
          <span>{isOpen ? 'Cerrar pieza' : 'Abrir pieza narrada'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-4 border-t border-hairline flex flex-col gap-4">
          {/* Scene stage */}
          <div className="bg-canvas border border-hairline p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-ochre tabular-nums">
                  Escena 0{activeSceneIdx + 1} / 0{INTRO_NARRATED_SCENES.length}
                </span>
                <h4 className="font-display text-lg sm:text-xl font-semibold text-ink">
                  {activeScene.rotulo}
                </h4>
              </div>
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                {formatTime(currentMs)} / 2:00
              </span>
            </div>

            <p className="font-display text-lg sm:text-xl leading-relaxed text-ink max-w-3xl min-h-[3.5rem]">
              {subsOn ? activeSubtitle : activeScene.narracion}
            </p>

            <p className="font-mono text-xs text-ink-muted">
              Claves visuales · {activeScene.visualHint}
            </p>

            {/* Progress bar */}
            <div
              className="h-1.5 w-full bg-surface-high overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={120}
              aria-valuenow={Math.floor(currentMs / 1000)}
              aria-label="Progreso de la introducción narrada"
            >
              <div
                className="h-full bg-ochre transition-[width] duration-100"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="min-h-[38px] px-4 py-1.5 text-xs font-semibold text-white bg-ink rounded inline-flex items-center gap-1.5 hover:bg-ochre transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{currentMs > 0 && currentMs < TOTAL_MS ? 'Continuar' : 'Reproducir'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => jumpToScene(activeSceneIdx - 1)}
                  disabled={activeSceneIdx === 0}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-ink bg-paper border border-hairline rounded inline-flex items-center gap-1 hover:border-ink disabled:opacity-40 cursor-pointer"
                  aria-label="Escena anterior"
                >
                  <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToScene(activeSceneIdx + 1)}
                  disabled={activeSceneIdx === INTRO_NARRATED_SCENES.length - 1}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-ink bg-paper border border-hairline rounded inline-flex items-center gap-1 hover:border-ink disabled:opacity-40 cursor-pointer"
                  aria-label="Escena siguiente"
                >
                  <span>Siguiente</span>
                  <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-ink-muted bg-canvas border border-hairline rounded inline-flex items-center gap-1 hover:text-ink hover:border-ink cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reiniciar</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {supportsSpeech && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = !voiceOn;
                      voiceOnRef.current = next;
                      setVoiceOn(next);
                      if (!next) {
                        try {
                          window.speechSynthesis.cancel();
                        } catch {
                          // ignore
                        }
                      } else if (isPlaying) {
                        speakText(activeScene.narracion, true);
                      }
                    }}
                    aria-pressed={voiceOn}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded border inline-flex items-center gap-1.5 cursor-pointer ${
                      voiceOn
                        ? 'bg-paper text-ink border-ink'
                        : 'bg-canvas text-ink-muted border-hairline'
                    }`}
                  >
                    {voiceOn ? (
                      <Volume2 className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>Voz: {voiceOn ? 'Activa' : 'Silenciada'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSubsOn((s) => !s)}
                  aria-pressed={subsOn}
                  className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded border inline-flex items-center gap-1.5 cursor-pointer ${
                    subsOn
                      ? 'bg-paper text-ink border-ink'
                      : 'bg-canvas text-ink-muted border-hairline'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
                  <span>Subtítulos: {subsOn ? 'Sí' : 'Texto completo'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 8 Scene Quick Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTRO_NARRATED_SCENES.map((sc, idx) => {
              const isCurrent = idx === activeSceneIdx;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => jumpToScene(idx)}
                  className={`text-left px-3 py-2 border rounded text-xs transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink border-hairline hover:border-ink'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] block tabular-nums ${
                      isCurrent ? 'text-white/75' : 'text-ochre'
                    }`}
                  >
                    0{idx + 1} · {formatTime(sc.startMs)}
                  </span>
                  <span className="font-medium leading-snug block truncate">{sc.rotulo}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
