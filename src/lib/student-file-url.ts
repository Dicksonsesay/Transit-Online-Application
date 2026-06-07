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
  return `/api/student/file?path=${encodeURIComponent(storedPath)}`;
}
