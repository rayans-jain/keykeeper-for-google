export interface ProcessedImage {
  base64: string;
  dataUrl: string;
  thumbnail: string;
}

const MAX_LONGEST_SIDE = 1024;
const THUMB_SIZE = 200;

function resizeToJpeg(img: HTMLImageElement, maxSide: number, quality: number): string {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function processImageFile(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) {
        reject(new Error("The selected image appears empty or unreadable."));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error("This image could not be decoded. Try JPG, PNG, or WebP."));
      img.onload = () => {
        try {
          const dataUrl = resizeToJpeg(img, MAX_LONGEST_SIDE, 0.8);
          const thumbnail = resizeToJpeg(img, THUMB_SIZE, 0.72);
          const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
          resolve({ base64, dataUrl, thumbnail });
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Failed to compress image."));
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function processDataUrl(sourceDataUrl: string): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Could not read captured photo."));
    img.onload = () => {
      try {
        const dataUrl = resizeToJpeg(img, MAX_LONGEST_SIDE, 0.8);
        const thumbnail = resizeToJpeg(img, THUMB_SIZE, 0.72);
        const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        resolve({ base64, dataUrl, thumbnail });
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to process photo."));
      }
    };
    img.src = sourceDataUrl;
  });
}