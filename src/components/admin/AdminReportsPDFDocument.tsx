import { Document, Page, Text, View } from "@react-pdf/renderer";
import PdfDocumentHeader from "@/components/admin/pdf/PdfDocumentHeader";
import type { AdminReportsData } from "@/lib/admin-reports";
import {
  formatPdfCurrency,
  formatPdfDate,
  pdfBaseStyles,
  PDF_COLORS,
} from "@/lib/pdf/pdf-styles";

type AdminReportsPDFDocumentProps = {
  report: AdminReportsData;
  collegeName?: string;
  tagline?: string;
  logoSrc?: string;
};

export default function AdminReportsPDFDocument({
  report,
  collegeName = "Transit College Sierra Leone",
  tagline,
  logoSrc,
}: AdminReportsPDFDocumentProps) {
  const generated = formatPdfDate(report.generatedAt);

  return (
    <Document>
      <Page size="A4" style={pdfBaseStyles.page}>
        <PdfDocumentHeader
          collegeName={collegeName}
          tagline={tagline}
          logoSrc={logoSrc}
          title="Admissions Operations Report"
          subtitle={`Generated ${generated}`}
        />

        <Text style={pdfBaseStyles.sectionTitle}>Executive Summary</Text>
        {[
          ["Total Applications", report.totals.applications],
          ["Accepted", report.totals.accepted],
          ["Rejected", report.totals.rejected],
          ["In Review", report.totals.inReview],
          ["Interviews Scheduled", report.totals.interviewsScheduled],
          ["Interviews Completed", report.totals.interviewsCompleted],
          ["PINs Issued", report.totals.pinsIssued],
          ["Offers of Admission", report.totals.acceptanceLetters],
        ].map(([label, value]) => (
          <View key={String(label)} style={pdfBaseStyles.summaryRow}>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>{label}</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: PDF_COLORS.primary }}>
              {value}
            </Text>
          </View>
        ))}

        <Text style={pdfBaseStyles.sectionTitle}>PIN Revenue</Text>
        <View style={pdfBaseStyles.summaryBox}>
          {[
            [
              "Total PIN value",
              `${report.pinRevenue.usedCount + report.pinRevenue.unusedCount} PINs`,
              formatPdfCurrency(report.pinRevenue.totalAmount),
            ],
            [
              "Used (redeemed)",
              `${report.pinRevenue.usedCount} PINs`,
              formatPdfCurrency(report.pinRevenue.usedAmount),
            ],
            [
              "Unused (outstanding)",
              `${report.pinRevenue.unusedCount} PINs`,
              formatPdfCurrency(report.pinRevenue.unusedAmount),
            ],
          ].map(([label, count, amount]) => (
            <View key={String(label)} style={pdfBaseStyles.summaryRow}>
              <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>
                {label} · {count}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>{amount}</Text>
            </View>
          ))}
        </View>

        <Text style={pdfBaseStyles.sectionTitle}>Conversion Metrics</Text>
        {[
          ["Acceptance Rate", `${report.conversion.acceptanceRate}%`],
          ["Rejection Rate", `${report.conversion.rejectionRate}%`],
          ["Decision Completion", `${report.conversion.completionRate}%`],
        ].map(([label, value]) => (
          <View key={String(label)} style={pdfBaseStyles.summaryRow}>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>{label}</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>{value}</Text>
          </View>
        ))}

        <Text style={pdfBaseStyles.sectionTitle}>Application Status</Text>
        {report.applicationsByStatus.map((status) => (
          <View key={status.label} style={pdfBaseStyles.summaryRow}>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>{status.label}</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>{status.value}</Text>
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

      <Page size="A4" style={pdfBaseStyles.page}>
        <Text style={pdfBaseStyles.sectionTitle}>Monthly Applications</Text>
        {report.monthlyApplications.map((month) => (
          <View key={month.monthLabel} style={pdfBaseStyles.summaryRow}>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted }}>{month.monthLabel}</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>{month.count}</Text>
          </View>
        ))}

        {report.programmeBreakdown.length > 0 ? (
          <>
            <Text style={pdfBaseStyles.sectionTitle}>Top Programmes</Text>
            {report.programmeBreakdown.map((programme) => (
              <View key={programme.programmeName} style={pdfBaseStyles.summaryRow}>
                <Text style={{ fontSize: 9, color: PDF_COLORS.muted, maxWidth: "70%" }}>
                  {programme.programmeName}
                </Text>
                <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                  {programme.count} ({programme.share}%)
                </Text>
              </View>
            ))}
          </>
        ) : null}

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
