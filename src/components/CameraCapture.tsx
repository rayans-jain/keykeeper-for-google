import { Camera, Check, RefreshCw, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCamera } from "@/hooks/useCamera";

interface CameraCaptureProps {
  onUsePhoto: (dataUrl: string) => void;
  onClose: () => void;
  onSwitchToUpload: () => void;
}

export function CameraCapture({ onUsePhoto, onClose, onSwitchToUpload }: CameraCaptureProps) {
  const { videoRef, active, starting, error, start, stop, switchCamera, captureFrame } =
    useCamera();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    void start("environment");
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const dataUrl = captureFrame();
    if (dataUrl) setPreview(dataUrl);
  };

  const handleRetake = () => {
    setPreview(null);
    void start();
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  if (error) {
    return (
      <div className="ewa-card ewa-animate-in p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-accent">Camera unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close camera"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSwitchToUpload}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            Upload photo instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ewa-card ewa-animate-in overflow-hidden p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {preview ? "Review photo" : "Center one object in the frame"}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close camera"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-primary">
        {preview ? (
          <img src={preview} alt="Captured item preview" className="h-full w-full object-cover" />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="h-full w-full object-cover"
            />
            {starting && !active && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/80 text-sm text-primary-foreground">
                Starting camera...
              </div>
            )}
            {/* Centered square framing guide */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="h-48 w-48 rounded-2xl border-2 border-primary-foreground/80 shadow-[0_0_0_9999px_rgba(11,31,58,0.28)] sm:h-60 sm:w-60" />
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        {preview ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Retake
            </button>
            <button
              type="button"
              onClick={() => onUsePhoto(preview)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Use photo
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={switchCamera}
              aria-label="Switch front or back camera"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={!active}
              onClick={handleCapture}
              aria-label="Capture photo"
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary bg-background text-primary transition-transform duration-200 hover:scale-105 disabled:opacity-40"
            >
              <Camera className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close camera"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}