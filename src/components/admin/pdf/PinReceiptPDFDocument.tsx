import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import PdfDocumentHeader from "@/components/admin/pdf/PdfDocumentHeader";
import {
  formatPdfCurrency,
  formatPdfDate,
  pdfBaseStyles,
  PDF_COLORS,
} from "@/lib/pdf/pdf-styles";

const styles = StyleSheet.create({
  receiptCard: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: PDF_COLORS.primary,
    borderRadius: 5,
    overflow: "hidden",
  },
  receiptBanner: {
    backgroundColor: PDF_COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  receiptBannerText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.8,
  },
  institutionName: {
    marginTop: 2,
    color: "#bfdbfe",
    fontSize: 8,
    textAlign: "center",
  },
  receiptBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailCell: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingRight: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.border,
  },
  detailLabel: { fontSize: 7.5, color: PDF_COLORS.muted },
  detailValue: { fontSize: 7.5, fontWeight: "bold", color: PDF_COLORS.text },
  highlightRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  pinBox: {
    flex: 1.2,
    padding: 8,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 4,
    alignItems: "center",
  },
  pinLabel: {
    fontSize: 7,
    color: PDF_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  pinValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    letterSpacing: 2,
  },
  amountBox: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fef9c3",
    borderRadius: 4,
  },
  amountLabel: { fontSize: 7.5, fontWeight: "bold", color: PDF_COLORS.text },
  amountValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
  },
  note: {
    marginTop: 8,
    fontSize: 7,
    lineHeight: 1.35,
    color: PDF_COLORS.muted,
  },
  portalSection: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 4,
  },
  portalInfo: {
    flex: 1,
    paddingRight: 8,
  },
  portalLabel: {
    fontSize: 7,
    color: PDF_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  portalTitle: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: "bold",
    color: PDF_COLORS.text,
  },
  portalUrl: {
    marginTop: 2,
    fontSize: 7,
    color: PDF_COLORS.primary,
    lineHeight: 1.3,
  },
  qrColumn: {
    alignItems: "center",
    flexShrink: 0,
  },
  qrImage: {
    width: 56,
    height: 56,
  },
  qrCaption: {
    marginTop: 2,
    fontSize: 6,
    color: PDF_COLORS.muted,
    textAlign: "center",
  },
  footerRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  stamp: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: PDF_COLORS.success,
    borderRadius: 3,
  },
  stampText: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: PDF_COLORS.success,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

export type PinReceiptData = {
  pinCode: string;
  receiptNumber: string;
  amount: string;
  generatedByName: string;
  createdAt: string;
};

type PinReceiptPDFDocumentProps = {
  receipt: PinReceiptData;
  collegeName: string;
  tagline?: string;
  logoSrc?: string;
  portalUrl: string;
  qrCodeSrc: string;
};

export default function PinReceiptPDFDocument({
  receipt,
  collegeName,
  tagline,
  logoSrc,
  portalUrl,
  qrCodeSrc,
}: PinReceiptPDFDocumentProps) {
  const details = [
    ["Receipt No.", receipt.receiptNumber],
    ["Date & Time", formatPdfDate(receipt.createdAt)],
    ["Issued By", receipt.generatedByName],
    ["Purpose", "Online Admission Registration"],
  ] as const;

  return (
    <Document>
      <Page size="A5" style={pdfBaseStyles.receiptPage}>
        <PdfDocumentHeader
          collegeName={collegeName}
          tagline={tagline}
          logoSrc={logoSrc}
          title="Payment Receipt"
          subtitle={`Issued ${formatPdfDate(receipt.createdAt)}`}
          compact
        />

        <View style={styles.receiptCard}>
          <View style={styles.receiptBanner}>
            <Text style={styles.receiptBannerText}>Admission PIN Receipt</Text>
            <Text style={styles.institutionName}>{collegeName}</Text>
          </View>

          <View style={styles.receiptBody}>
            <View style={styles.detailsGrid}>
              {details.map(([label, value]) => (
                <View key={label} style={styles.detailCell}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.highlightRow}>
              <View style={styles.pinBox}>
                <Text style={styles.pinLabel}>Admission PIN</Text>
                <Text style={styles.pinValue}>{receipt.pinCode}</Text>
              </View>
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Amount Paid</Text>
                <Text style={styles.amountValue}>{formatPdfCurrency(receipt.amount)}</Text>
              </View>
            </View>

            <Text style={styles.note}>
              This receipt confirms payment of the admission fee. Use your PIN at the Online
              Admission Portal to verify payment, register, and complete your application.
            </Text>

            <View style={styles.portalSection}>
              <View style={styles.portalInfo}>
                <Text style={styles.portalLabel}>Online Admission Portal</Text>
                <Text style={styles.portalTitle}>Verify PIN and Register</Text>
                <Text style={styles.portalUrl}>{portalUrl}</Text>
              </View>
              <View style={styles.qrColumn}>
                <Image src={qrCodeSrc} style={styles.qrImage} />
                <Text style={styles.qrCaption}>Scan to open</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.stamp}>
                <Text style={styles.stampText}>Official Receipt</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={pdfBaseStyles.receiptFooter} fixed>
          <Text style={pdfBaseStyles.footerText}>{collegeName}</Text>
          <Text style={pdfBaseStyles.footerText}>Admission PIN — {receipt.receiptNumber}</Text>
        </View>
      </Page>
    </Document>
  );
}
