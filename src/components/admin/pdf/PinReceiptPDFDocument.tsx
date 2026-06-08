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
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: PDF_COLORS.primary,
    borderRadius: 6,
    overflow: "hidden",
  },
  receiptBanner: {
    backgroundColor: PDF_COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  receiptBannerText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  institutionRow: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.border,
    alignItems: "center",
  },
  institutionName: {
    fontSize: 11,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    textAlign: "center",
  },
  receiptBody: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  pinBox: {
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 4,
    alignItems: "center",
  },
  pinLabel: {
    fontSize: 8,
    color: PDF_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pinValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    letterSpacing: 3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.border,
  },
  detailLabel: { fontSize: 9, color: PDF_COLORS.muted },
  detailValue: { fontSize: 9, fontWeight: "bold", color: PDF_COLORS.text },
  amountRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fef9c3",
    borderRadius: 4,
  },
  amountLabel: { fontSize: 10, fontWeight: "bold", color: PDF_COLORS.text },
  amountValue: { fontSize: 14, fontWeight: "bold", color: PDF_COLORS.primary },
  note: {
    marginTop: 16,
    fontSize: 8,
    lineHeight: 1.5,
    color: PDF_COLORS.muted,
  },
  portalSection: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 4,
  },
  portalInfo: {
    flex: 1,
    paddingRight: 12,
  },
  portalLabel: {
    fontSize: 8,
    color: PDF_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  portalTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: PDF_COLORS.text,
    marginBottom: 4,
  },
  portalUrl: {
    fontSize: 8,
    color: PDF_COLORS.primary,
    lineHeight: 1.4,
  },
  portalHint: {
    marginTop: 6,
    fontSize: 7,
    color: PDF_COLORS.muted,
    lineHeight: 1.4,
  },
  qrColumn: {
    alignItems: "center",
    flexShrink: 0,
  },
  qrImage: {
    width: 72,
    height: 72,
  },
  qrCaption: {
    marginTop: 4,
    fontSize: 7,
    color: PDF_COLORS.muted,
    textAlign: "center",
  },
  stamp: {
    marginTop: 14,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: PDF_COLORS.success,
    borderRadius: 4,
  },
  stampText: {
    fontSize: 9,
    fontWeight: "bold",
    color: PDF_COLORS.success,
    textTransform: "uppercase",
    letterSpacing: 1,
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
  return (
    <Document>
      <Page size="A5" style={pdfBaseStyles.page}>
        <PdfDocumentHeader
          collegeName={collegeName}
          tagline={tagline}
          logoSrc={logoSrc}
          title="Payment Receipt"
          subtitle={`Issued ${formatPdfDate(receipt.createdAt)}`}
        />

        <View style={styles.receiptCard}>
          <View style={styles.receiptBanner}>
            <Text style={styles.receiptBannerText}>Admission PIN Receipt</Text>
          </View>
          <View style={styles.institutionRow}>
            <Text style={styles.institutionName}>{collegeName}</Text>
          </View>
          <View style={styles.receiptBody}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt No.</Text>
              <Text style={styles.detailValue}>{receipt.receiptNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{formatPdfDate(receipt.createdAt)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issued By</Text>
              <Text style={styles.detailValue}>{receipt.generatedByName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Purpose</Text>
              <Text style={styles.detailValue}>Online Admission Registration</Text>
            </View>

            <View style={styles.pinBox}>
              <Text style={styles.pinLabel}>Admission PIN</Text>
              <Text style={styles.pinValue}>{receipt.pinCode}</Text>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount Paid</Text>
              <Text style={styles.amountValue}>{formatPdfCurrency(receipt.amount)}</Text>
            </View>

            <Text style={styles.note}>
              This receipt confirms payment of the admission fee. Use your PIN at the Online
              Admission Portal to verify your payment, create your account, and complete your
              application. Keep this receipt for your records.
            </Text>

            <View style={styles.portalSection}>
              <View style={styles.portalInfo}>
                <Text style={styles.portalLabel}>Online Admission Portal</Text>
                <Text style={styles.portalTitle}>Verify PIN and Register</Text>
                <Text style={styles.portalUrl}>{portalUrl}</Text>
                <Text style={styles.portalHint}>
                  Visit the link above or scan the QR code to open the portal and enter your
                  admission PIN.
                </Text>
              </View>
              <View style={styles.qrColumn}>
                <Image src={qrCodeSrc} style={styles.qrImage} />
                <Text style={styles.qrCaption}>Scan to open portal</Text>
              </View>
            </View>

            <View style={styles.stamp}>
              <Text style={styles.stampText}>Official Receipt</Text>
            </View>
          </View>
        </View>

        <View style={pdfBaseStyles.footer} fixed>
          <Text style={pdfBaseStyles.footerText}>{collegeName}</Text>
          <Text style={pdfBaseStyles.footerText}>Admission PIN — {receipt.receiptNumber}</Text>
        </View>
      </Page>
    </Document>
  );
}
