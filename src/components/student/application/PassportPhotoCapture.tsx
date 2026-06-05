"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCamera, FiUpload } from "react-icons/fi";
import { showError, showSuccess } from "@/lib/alerts";
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
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }
}

export default function PassportPhotoCapture({
  photoUrl,
  onUploaded,
}: PassportPhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState(photoUrl ?? "");
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setTimeout(() => setPreview(photoUrl ?? ""), 0);
  }, [photoUrl]);

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

  // Attach stream after the <video> element mounts (cameraOn === true).
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
        await showError("Upload failed", data.error ?? "Could not upload photo.");
        return;
      }

      setPreview(data.filePath);
      onUploaded(data.filePath);
      await showSuccess("Photo saved", "Your passport photo has been uploaded.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;
    stopCamera();
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    await uploadBlob(file, file.name);
    URL.revokeObjectURL(objectUrl);
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

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      await showError(
        "Camera not ready",
        "Wait for the camera preview to appear, then try again."
      );
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    stopCamera();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
    if (!blob) return;

    const objectUrl = URL.createObjectURL(blob);
    setPreview(objectUrl);
    await uploadBlob(blob, `passport-${Date.now()}.jpg`);
    URL.revokeObjectURL(objectUrl);
  }

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
            "relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-zinc-900",
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
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 text-xs text-white">
                  Starting camera…
                </div>
              )}
            </>
          ) : preview ? (
            <Image
              src={preview}
              alt="Passport preview"
              fill
              className="object-cover"
              unoptimized
            />
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
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
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
                onClick={captureSnapshot}
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
