import { Camera, Upload } from "lucide-react";
import { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

interface UploadZoneProps {
  disabled?: boolean;
  onFileSelected: (file: File) => void;
  onOpenCamera: () => void;
  onError: (message: string) => void;
}

export function UploadZone({ disabled, onFileSelected, onOpenCamera, onError }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      onError("Image is larger than 10MB. Please choose a smaller photo.");
      return;
    }
    onFileSelected(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`ewa-card p-6 transition-colors duration-200 sm:p-10 ${
        dragging ? "border-primary bg-secondary" : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Upload an item photo"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Scan an item in seconds
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Photograph or upload one object. We check if it is a valuable first, then analyze the
          material and find DIY reuse ideas.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="group flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background p-6 text-center transition-all duration-200 hover:border-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
            <Upload className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <div className="font-display text-base font-semibold text-foreground">Upload photo</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Drag and drop or browse · JPG, PNG, WebP up to 10MB
            </div>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onOpenCamera}
          className="group flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border border-primary bg-primary p-6 text-center text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary transition-transform duration-200 group-hover:scale-105">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <div className="font-display text-base font-semibold">Use camera</div>
            <div className="mt-1 text-xs text-primary-foreground/80">
              Live viewfinder with instant capture
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}