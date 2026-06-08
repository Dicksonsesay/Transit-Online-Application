import { StyleSheet } from "@react-pdf/renderer";

export const PDF_COLORS = {
  primary: "#003e91",
  primaryLight: "#1e5aa8",
  accent: "#f1c40f",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  success: "#059669",
  danger: "#dc2626",
};

export const pdfBaseStyles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: PDF_COLORS.text,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: PDF_COLORS.primary,
  },
  headerLeft: {
    flex: 1,
    maxWidth: "58%",
    paddingRight: 12,
  },
  headerRight: {
    flexShrink: 0,
    maxWidth: "40%",
    alignItems: "flex-end",
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  collegeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
  },
  collegeTagline: {
    fontSize: 8,
    color: PDF_COLORS.muted,
    marginTop: 2,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    textAlign: "right",
  },
  docMeta: {
    fontSize: 8,
    color: PDF_COLORS.muted,
    textAlign: "right",
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    marginTop: 14,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.border,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: PDF_COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 8,
    color: PDF_COLORS.text,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: "bold",
    color: PDF_COLORS.muted,
    textTransform: "uppercase",
  },
  summaryBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: PDF_COLORS.border,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: PDF_COLORS.muted,
  },
});

export function formatPdfCurrency(amount: number | string) {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-SL", {
    style: "currency",
    currency: "SLE",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPdfDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function exportFilename(prefix: string, ext: string) {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.${ext}`;
}
