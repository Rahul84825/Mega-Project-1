import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const SoundContext = createContext(null);

const SOUND_FILES = {
  order: "/sounds/zomato_ring_5.mp3",
  cart: "/sounds/zomato_ring_5.mp3",
  wishlist: "/sounds/zomato_ring_5.mp3",
};

const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

export const SoundProvider = ({ children }) => {
  const { user } = useAuth();
  const unlockedRef = useRef(false);
  const pendingAdminSoundRef = useRef(false);
  const audioMapRef = useRef({});

  const ensureAudio = useCallback((name) => {
    if (!audioMapRef.current[name]) {
      const sound = new Audio(SOUND_FILES[name] || SOUND_FILES.cart);
      sound.preload = "auto";
      sound.loop = false;
      sound.load();
      audioMapRef.current[name] = sound;
    }
    return audioMapRef.current[name];
  }, []);

  const play = useCallback(async (name = "cart", { loopWhileHidden = false } = {}) => {
    const audio = ensureAudio(name);
    if (!audio) return false;

    audio.loop = loopWhileHidden && document.hidden;

    if (!audio.paused) audio.pause();
    audio.currentTime = 0;

    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, [ensureAudio]);

  const stop = useCallback((name = "order") => {
    const audio = audioMapRef.current[name];
    if (!audio) return;
    if (!audio.paused) audio.pause();
    audio.currentTime = 0;
  }, []);

  const unlockAudio = useCallback(async () => {
    if (unlockedRef.current) return;

    const names = Object.keys(SOUND_FILES);
    try {
      for (const name of names) {
        const audio = ensureAudio(name);
        const prevMuted = audio.muted;
        audio.muted = true;
        audio.currentTime = 0;
        try {
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
        } catch {
          // ignore: some browsers may still block until stronger interaction
        }
        audio.muted = prevMuted;
      }
      unlockedRef.current = true;

      if (pendingAdminSoundRef.current) {
        pendingAdminSoundRef.current = false;
        play("order", { loopWhileHidden: true });
      }
    } catch {
      // keep waiting for another interaction
    }
  }, [ensureAudio, play]);

  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) stop("order");
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [unlockAudio, stop]);

  // Admin order notifications now run globally, not inside admin layout.
  useEffect(() => {
    if (!user || user.role !== "admin") return undefined;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
    });

    socket.on("newOrder", async () => {
      const ok = await play("order", { loopWhileHidden: true });
      if (!ok) pendingAdminSoundRef.current = true;
    });

    return () => {
      stop("order");
      socket.disconnect();
    };
  }, [play, stop, user]);

  const value = useMemo(() => ({ play, stop, unlockAudio }), [play, stop, unlockAudio]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside SoundProvider");
  return ctx;
};
