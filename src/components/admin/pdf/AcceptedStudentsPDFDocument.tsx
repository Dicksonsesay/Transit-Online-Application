import { Document, Page, Text, View } from "@react-pdf/renderer";
import PdfDocumentHeader from "@/components/admin/pdf/PdfDocumentHeader";
import type { AcceptanceLetterCandidate } from "@/lib/admin-acceptance-letters";
import { formatPdfDate, pdfBaseStyles, PDF_COLORS } from "@/lib/pdf/pdf-styles";

type AcceptedStudentsPDFDocumentProps = {
  students: AcceptanceLetterCandidate[];
  collegeName: string;
  tagline?: string;
  logoSrc?: string;
};

const colWidths = ["10%", "14%", "16%", "18%", "14%", "8%", "10%", "10%"];

export default function AcceptedStudentsPDFDocument({
  students,
  collegeName,
  tagline,
  logoSrc,
}: AcceptedStudentsPDFDocumentProps) {
  const headers = [
    "App. No.",
    "Student",
    "Email",
    "Programme",
    "Course",
    "Year",
    "Letter Ref.",
    "Offer",
  ];

  const offersSent = students.filter((s) => s.publishedAt).length;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfBaseStyles.page}>
        <PdfDocumentHeader
          collegeName={collegeName}
          tagline={tagline}
          logoSrc={logoSrc}
          title="Accepted Students Register"
          subtitle={`${students.length} admitted · ${formatPdfDate(new Date())}`}
        />

        <View style={pdfBaseStyles.summaryBox}>
          {[
            ["Total accepted", `${students.length}`],
            ["Offers sent to students", `${offersSent}`],
            ["Offers pending send", `${students.length - offersSent}`],
          ].map(([label, value]) => (
            <View key={label} style={pdfBaseStyles.summaryRow}>
              <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>{label}</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: PDF_COLORS.primary }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        <Text style={pdfBaseStyles.sectionTitle}>Admitted Students</Text>
        <View style={pdfBaseStyles.tableHeader}>
          {headers.map((header, index) => (
            <Text
              key={header}
              style={[pdfBaseStyles.tableHeaderCell, { width: colWidths[index] }]}
            >
              {header}
            </Text>
          ))}
        </View>

        {students.map((student) => (
          <View key={student.studentId} style={pdfBaseStyles.tableRow} wrap={false}>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[0] }]}>
              {student.applicationNumber ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[1], fontWeight: "bold" }]}>
              {student.studentName}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[2] }]}>
              {student.studentEmail}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[3] }]}>
              {student.programmeName}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[4] }]}>
              {student.courseName ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[5] }]}>
              {student.admissionYear}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[6] }]}>
              {student.letterReference ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[7] }]}>
              {student.publishedAt ? "Sent" : student.generatedAt ? "Draft" : "Pending"}
            </Text>
          </View>
        ))}

        <View style={pdfBaseStyles.footer} fixed>
          <Text style={pdfBaseStyles.footerText}>{collegeName}</Text>
          <Text
            style={pdfBaseStyles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
