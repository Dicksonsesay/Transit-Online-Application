function isPublicBlobUrl(url: string): boolean {
  return url.includes(".public.blob.vercel-storage.com");
}

/** Client-safe URL for displaying a stored student upload in the browser. */
export function toStudentFileDisplayUrl(
  storedPath: string | null | undefined
): string {
  if (!storedPath) return "";
  if (
    storedPath.startsWith("blob:") ||
    storedPath.startsWith("/api/student/file")
  ) {
    return storedPath;
  }
  if (/^https?:\/\//i.test(storedPath)) {
    if (isPublicBlobUrl(storedPath)) {
      return storedPath;
    }
    return `/api/student/file?path=${encodeURIComponent(storedPath)}`;
  }
  if (storedPath.startsWith("/uploads/")) {
    return storedPath;
  }
  return `/api/student/file?path=${encodeURIComponent(storedPath)}`;
}
