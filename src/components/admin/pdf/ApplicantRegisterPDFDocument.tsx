import { Document, Page, Text, View } from "@react-pdf/renderer";
import PdfDocumentHeader from "@/components/admin/pdf/PdfDocumentHeader";
import type { ApplicantListItem } from "@/lib/admin-applicants";
import { applicationStatusLabel } from "@/lib/application-status";
import { formatPdfDate, pdfBaseStyles, PDF_COLORS } from "@/lib/pdf/pdf-styles";

type ApplicantRegisterPDFDocumentProps = {
  applicants: ApplicantListItem[];
  collegeName: string;
  tagline?: string;
  logoSrc?: string;
  title: string;
  filterLabel: string;
};

const colWidths = ["11%", "15%", "16%", "10%", "18%", "14%", "10%", "6%"];

export default function ApplicantRegisterPDFDocument({
  applicants,
  collegeName,
  tagline,
  logoSrc,
  title,
  filterLabel,
}: ApplicantRegisterPDFDocumentProps) {
  const headers = [
    "App. No.",
    "Full Name",
    "Email",
    "Phone",
    "Programme",
    "First Choice",
    "Status",
    "Submitted",
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfBaseStyles.page}>
        <PdfDocumentHeader
          collegeName={collegeName}
          tagline={tagline}
          logoSrc={logoSrc}
          title={title}
          subtitle={`${filterLabel} · ${applicants.length} records · ${formatPdfDate(new Date())}`}
        />

        <View style={pdfBaseStyles.summaryBox}>
          <View style={pdfBaseStyles.summaryRow}>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>Total records in this export</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: PDF_COLORS.primary }}>
              {applicants.length}
            </Text>
          </View>
        </View>

        <Text style={pdfBaseStyles.sectionTitle}>Applicant Register</Text>
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

        {applicants.map((applicant) => (
          <View key={applicant.applicationId} style={pdfBaseStyles.tableRow} wrap={false}>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[0] }]}>
              {applicant.applicationNumber ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[1], fontWeight: "bold" }]}>
              {applicant.fullname}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[2] }]}>
              {applicant.email}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[3] }]}>
              {applicant.phone ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[4] }]}>
              {applicant.programmeName}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[5] }]}>
              {applicant.firstChoiceCourse ?? "—"}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[6] }]}>
              {applicationStatusLabel[applicant.applicationStatus]}
            </Text>
            <Text style={[pdfBaseStyles.tableCell, { width: colWidths[7] }]}>
              {applicant.submittedAt.slice(0, 10)}
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
