import { useCallback, useEffect, useRef, useState } from "react";

export type FacingMode = "environment" | "user";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const stop = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
    setStarting(false);
  }, []);

  const start = useCallback(
    async (mode: FacingMode = facingMode) => {
      stop();
      setError(null);
      setStarting(true);

      if (typeof window !== "undefined" && !window.isSecureContext) {
        setStarting(false);
        setError("Camera access requires a secure (HTTPS) connection. Use Upload photo instead.");
        return;
      }

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStarting(false);
        setError("Your browser does not support live camera access. Use Upload photo instead.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode } },
          audio: false,
        });
        streamRef.current = stream;
        setFacingMode(mode);
        setActive(true);
        setStarting(false);
      } catch (err) {
        setStarting(false);
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setError("Camera permission was denied. Allow camera access or use Upload photo.");
        } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          setError("No camera was found on this device. Use Upload photo instead.");
        } else {
          setError("Could not start the camera. Use Upload photo instead.");
        }
      }
    },
    [facingMode, stop],
  );

  useEffect(() => {
    if (active && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => {});
    }
  }, [active]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      }
    };
  }, []);

  const switchCamera = useCallback(() => {
    const next: FacingMode = facingMode === "environment" ? "user" : "environment";
    void start(next);
  }, [facingMode, start]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stop();
    return dataUrl;
  }, [stop]);

  return {
    videoRef,
    active,
    starting,
    facingMode,
    error,
    start,
    stop,
    switchCamera,
    captureFrame,
    clearError: () => setError(null),
  };
}