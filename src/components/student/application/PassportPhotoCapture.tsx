"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiCamera, FiUpload } from "react-icons/fi";
import { showError, showSuccess } from "@/lib/alerts";
import { toStudentFileDisplayUrl } from "@/lib/student-file-url";
import { cn } from "@/lib/utils";

type PassportPhotoCaptureProps = {
  photoUrl?: string;
  onUploaded: (filePath: string) => void;
};

async function requestCameraStream(): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: "user" },
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
    audio: false,
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }
}

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }

    const done = () => {
      video.removeEventListener("loadeddata", done);
      video.removeEventListener("playing", done);
      resolve();
    };

    video.addEventListener("loadeddata", done);
    video.addEventListener("playing", done);
  });
}

async function waitForPaintedFrames(video: HTMLVideoElement): Promise<void> {
  await waitForVideoFrame(video);
  for (let i = 0; i < 3; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

function isCanvasMostlyBlack(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const sampleWidth = Math.min(canvas.width, 64);
  const sampleHeight = Math.min(canvas.height, 64);
  if (sampleWidth === 0 || sampleHeight === 0) return true;

  const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  let darkPixels = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] + data[i + 1] + data[i + 2] < 30) darkPixels++;
  }

  return darkPixels / totalPixels > 0.95;
}

export default function PassportPhotoCapture({
  photoUrl,
  onUploaded,
}: PassportPhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewBlobRef = useRef<string | null>(null);
  const displayUrlRef = useRef("");
  const [preview, setPreview] = useState(photoUrl ?? "");
  const [displayUrl, setDisplayUrl] = useState(
    toStudentFileDisplayUrl(photoUrl)
  );
  displayUrlRef.current = displayUrl;
  const [imageError, setImageError] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const revokePreviewBlob = useCallback(() => {
    if (previewBlobRef.current) {
      URL.revokeObjectURL(previewBlobRef.current);
      previewBlobRef.current = null;
    }
  }, []);

  const setPreviewBlobUrl = useCallback(
    (blob: Blob) => {
      revokePreviewBlob();
      const objectUrl = URL.createObjectURL(blob);
      previewBlobRef.current = objectUrl;
      setDisplayUrl(objectUrl);
      return objectUrl;
    },
    [revokePreviewBlob]
  );

  useEffect(() => {
    setPreview(photoUrl ?? "");
    const nextUrl = toStudentFileDisplayUrl(photoUrl);
    setDisplayUrl(nextUrl);
    setImageError(false);
    if (!nextUrl.startsWith("blob:")) {
      revokePreviewBlob();
    }
  }, [photoUrl, revokePreviewBlob]);

  useEffect(() => () => revokePreviewBlob(), [revokePreviewBlob]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    if (!cameraOn) return;

    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    let cancelled = false;
    setCameraReady(false);
    video.srcObject = stream;

    const markReady = () => {
      if (!cancelled && video.videoWidth > 0 && video.videoHeight > 0) {
        setCameraReady(true);
      }
    };

    const playStream = async () => {
      try {
        await video.play();
        await waitForVideoFrame(video);
        markReady();
      } catch {
        if (!cancelled) {
          await showError(
            "Camera playback failed",
            "Could not start the camera preview. Try uploading a photo instead."
          );
          stopCamera();
        }
      }
    };

    video.addEventListener("loadedmetadata", markReady);
    void playStream();

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", markReady);
    };
  }, [cameraOn, stopCamera]);

  async function uploadBlob(blob: Blob, fileName: string) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("category", "passport_photo");
      formData.append("file", blob, fileName);

      const res = await fetch("/api/student/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { filePath?: string; error?: string };

      if (!res.ok || !data.filePath) {
        setPreview(photoUrl ?? "");
        revokePreviewBlob();
        setDisplayUrl(toStudentFileDisplayUrl(photoUrl));
        setImageError(false);
        await showError("Upload failed", data.error ?? "Could not upload photo.");
        return;
      }

      setPreview(data.filePath);
      setDisplayUrl(toStudentFileDisplayUrl(data.filePath));
      setImageError(false);
      onUploaded(data.filePath);
      await showSuccess("Photo saved", "Your passport photo has been uploaded.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;
    stopCamera();
    setPreview(file.name);
    setPreviewBlobUrl(file);
    setImageError(false);
    await uploadBlob(file, file.name);
  }

  async function startCamera() {
    try {
      const stream = await requestCameraStream();
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      await showError(
        "Camera unavailable",
        "Allow camera access or upload a photo from your device."
      );
    }
  }

  async function captureSnapshot() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0 || !cameraReady) {
      await showError(
        "Camera not ready",
        "Wait for the camera preview to appear, then try again."
      );
      return;
    }

    await waitForPaintedFrames(video);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    if (isCanvasMostlyBlack(canvas)) {
      await showError(
        "Camera not ready",
        "The snapshot was blank. Wait for the preview, then try again."
      );
      return;
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
    stopCamera();
    if (!blob) return;

    setPreview("Captured photo");
    setPreviewBlobUrl(blob);
    setImageError(false);
    await uploadBlob(blob, `passport-${Date.now()}.jpg`);
  }

  const showImage = !cameraOn && Boolean(displayUrl) && !imageError;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-semibold text-[var(--primary-blue)]">
        Passport photograph
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Upload a clear passport-style photo or take a snapshot with your camera.
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100",
            (preview || cameraOn) && "border-solid border-[var(--primary-blue)]"
          )}
        >
          {cameraOn ? (
            <>
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200/90 text-xs text-zinc-600">
                  Starting camera…
                </div>
              )}
            </>
          ) : showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={displayUrl}
              src={displayUrl}
              alt="Passport preview"
              className="h-full w-full object-cover"
              onLoad={() => {
                setImageError(false);
                if (
                  previewBlobRef.current &&
                  displayUrlRef.current !== previewBlobRef.current
                ) {
                  revokePreviewBlob();
                }
              }}
              onError={(event) => {
                if (
                  (event.currentTarget as HTMLImageElement).src !==
                  displayUrlRef.current
                ) {
                  return;
                }
                setImageError(true);
              }}
            />
          ) : imageError ? (
            <p className="px-2 text-center text-xs text-zinc-500">
              Preview unavailable. Re-upload your photo.
            </p>
          ) : (
            <FiCamera size={32} className="text-zinc-400" aria-hidden />
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              void handleFileChange(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading || cameraOn}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--hero-blue)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            <FiUpload size={16} aria-hidden />
            Upload photo
          </button>
          {!cameraOn ? (
            <button
              type="button"
              disabled={uploading}
              onClick={startCamera}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--primary-blue)] ring-1 ring-slate-200 hover:bg-white disabled:opacity-60"
            >
              <FiCamera size={16} aria-hidden />
              Use camera
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploading || !cameraReady}
                onClick={() => void captureSnapshot()}
                className="flex-1 rounded-lg bg-[var(--primary-yellow)] px-3 py-2 text-sm font-semibold text-[var(--dark-blue)] disabled:opacity-60"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg px-3 py-2 text-sm text-zinc-600 ring-1 ring-slate-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" aria-hidden />
    </div>
  );
}
