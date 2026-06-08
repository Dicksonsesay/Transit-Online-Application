import { Document, Page, Text, View } from "@react-pdf/renderer";
import PdfDocumentHeader from "@/components/admin/pdf/PdfDocumentHeader";
import type { InterviewListItem } from "@/lib/admin-interviews";
import { interviewStatusLabel } from "@/lib/interview-status";
import { formatPdfDate, pdfBaseStyles, PDF_COLORS } from "@/lib/pdf/pdf-styles";

type InterviewRegisterPDFDocumentProps = {
  interviews: InterviewListItem[];
  collegeName: string;
  tagline?: string;
  logoSrc?: string;
};

const colWidths = ["10%", "14%", "16%", "9%", "8%", "16%", "10%", "10%", "7%"];

export default function InterviewRegisterPDFDocument({
  interviews,
  collegeName,
  tagline,
  logoSrc,
}: InterviewRegisterPDFDocumentProps) {
  const headers = [
    "App. No.",
    "Student",
    "Email",
    "Date",
    "Time",
    "Venue",
    "Status",
    "Scheduled By",
    "Remarks",
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfBaseStyles.page}>
        <PdfDocumentHeader
          collegeName={collegeName}
          tagline={tagline}
          logoSrc={logoSrc}
          title="Interview Register"
          subtitle={`${interviews.length} interviews · ${formatPdfDate(new Date())}`}
        />

        <View style={pdfBaseStyles.summaryBox}>
          <View style={pdfBaseStyles.summaryRow}>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>Total interviews</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: PDF_COLORS.primary }}>
              {interviews.length}
            </Text>
          </View>
        </View>

        <Text style={pdfBaseStyles.sectionTitle}>Interview Schedule</Text>
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

        {interviews.map((interview) => (
          <View key={interview.id} style={pdfBaseStyles.tableRow} wrap={false}>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[0] }]}>
              {interview.applicationNumber ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[1], fontWeight: "bold" }]}>
              {interview.studentName}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[2] }]}>
              {interview.email}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[3] }]}>
              {interview.interviewDate}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[4] }]}>
              {new Date(interview.interviewTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[5] }]}>
              {interview.venue ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[6] }]}>
              {interviewStatusLabel[interview.interviewStatus]}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[7] }]}>
              {interview.scheduledByName}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[8] }]}>
              {interview.remarks ?? "—"}
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
