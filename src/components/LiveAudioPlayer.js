"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaPause, FaPlay, FaSpinner, FaVolumeUp } from "react-icons/fa";

// Stream Shoutcast v1 (responde "ICY 200 OK", ignora Range). El parámetro `t`
// evita que iOS/Safari reutilice una respuesta vieja al reconectar.
const STREAM_URL = "https://servers58.com/proxy/sc_elvitrola?mp=/;";

const BARS = [
  { delay: "0s", duration: "0.9s" },
  { delay: "0.2s", duration: "1.1s" },
  { delay: "0.1s", duration: "0.8s" },
  { delay: "0.35s", duration: "1s" },
  { delay: "0.05s", duration: "1.2s" },
  { delay: "0.3s", duration: "0.85s" },
  { delay: "0.15s", duration: "1.05s" },
  { delay: "0.4s", duration: "0.95s" },
  { delay: "0.25s", duration: "1.15s" },
];

const STATUS_TEXT = {
  idle: "⬇ Dale Play a la señal EN VIVO ⬇",
  loading: "Conectando con la señal…",
  playing: "🎶 Estás escuchando la transmisión en vivo de “El Vitrola” 📻 🎶",
  error: "No pudimos conectar con la señal. Toca para reintentar.",
};

export default function LiveAudioPlayer() {
  const audioRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [volume, setVolume] = useState(1);
  const [canSetVolume, setCanSetVolume] = useState(false);

  // Es una radio en vivo: al detener se suelta la conexión, y al volver a
  // reproducir se abre una nueva. Reanudar una conexión pausada deja el audio
  // viejo y en iOS suele no reanudar nunca.
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setStatus("idle");
  }, []);

  // play() debe ejecutarse de forma síncrona dentro del gesto del usuario
  // (tap), si no iOS lo bloquea.
  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setStatus("loading");
    audio.src = `${STREAM_URL}&t=${Date.now()}`;
    audio.play().catch((err) => {
      if (err?.name !== "AbortError") setStatus("error");
    });
  }, []);

  const toggle = () => {
    if (status === "idle" || status === "error") start();
    else stop();
  };

  // iOS ignora audio.volume (siempre queda en 1): solo mostramos el control
  // si el navegador realmente lo respeta.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const original = audio.volume;
    audio.volume = 0.5;
    setCanSetVolume(audio.volume === 0.5);
    audio.volume = original;
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Controles en pantalla de bloqueo / centro de control.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({
      title: "Señal en vivo",
      artist: "El Vitrola de Chile",
      album: "Radio",
      artwork: [
        { src: "/logo-vitro.png", sizes: "907x567", type: "image/png" },
      ],
    });
    session.setActionHandler("play", start);
    session.setActionHandler("pause", stop);
    session.setActionHandler("stop", stop);
    return () => {
      session.setActionHandler("play", null);
      session.setActionHandler("pause", null);
      session.setActionHandler("stop", null);
    };
  }, [start, stop]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState =
      status === "playing" ? "playing" : "paused";
  }, [status]);

  const isPlaying = status === "playing";
  const isLoading = status === "loading";

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-2xl shadow-black/40 backdrop-blur-md sm:p-6">
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus((s) => (s === "playing" ? "loading" : s))}
        onPause={() => {
          // Pausa externa (auriculares, llamada, pantalla de bloqueo): se
          // cierra la conexión para que el próximo play vuelva en vivo.
          if (audioRef.current?.getAttribute("src")) stop();
        }}
        onError={() => {
          if (audioRef.current?.getAttribute("src")) setStatus("error");
        }}
        onEnded={() => setStatus("error")}
      />

      <p
        role="status"
        aria-live="polite"
        className={`min-h-[3rem] text-sm font-bold sm:text-base ${
          status === "idle" ? "animate-pulse" : ""
        } ${status === "error" ? "text-red-300" : "text-white"}`}
      >
        {STATUS_TEXT[status]}
      </p>

      {/* Monitos bailando mientras suena (el GIF solo se carga al reproducir) */}
      <div className="my-2 flex h-[59px] items-end justify-center gap-2">
        {isPlaying &&
          [0, 1, 2].map((i) => (
            <Image
              key={i}
              src="/bailarin1.gif"
              alt="Monito bailando"
              width={40}
              height={59}
              unoptimized
            />
          ))}
      </div>

      {/* Ondas */}
      <div
        aria-hidden="true"
        className="mx-auto flex h-10 items-end justify-center gap-1.5"
      >
        {BARS.map((bar, i) => (
          <span
            key={i}
            className={`h-full w-1.5 origin-bottom rounded-full bg-vitro ${
              isPlaying
                ? "animate-wave motion-reduce:animate-none"
                : "scale-y-[0.15] opacity-40"
            }`}
            style={
              isPlaying
                ? { animationDelay: bar.delay, animationDuration: bar.duration }
                : undefined
            }
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying || isLoading ? "Detener" : "Reproducir en vivo"}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-vitro text-3xl text-black shadow-lg shadow-vitro/30 outline-none transition active:scale-95 focus-visible:ring-4 focus-visible:ring-white/60 enabled:hover:brightness-110"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : isPlaying ? (
            <FaPause />
          ) : (
            <FaPlay className="translate-x-0.5" />
          )}
        </button>
      </div>

      {canSetVolume && (
        <label className="mx-auto mt-5 flex max-w-xs items-center gap-3 text-white/70">
          <FaVolumeUp aria-hidden="true" />
          <span className="sr-only">Volumen</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-vitro"
          />
        </label>
      )}
    </div>
  );
}
