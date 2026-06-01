import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { AdminReportsData } from "@/lib/admin-reports";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003e91",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#003e91",
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  label: { color: "#475569" },
  value: { fontWeight: "bold", color: "#003e91" },
});

type AdminReportsPDFDocumentProps = {
  report: AdminReportsData;
  collegeName?: string;
};

export default function AdminReportsPDFDocument({
  report,
  collegeName = "Transit College Sierra Leone",
}: AdminReportsPDFDocumentProps) {
  const generated = new Date(report.generatedAt).toLocaleString("en-GB");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{collegeName}</Text>
        <Text style={styles.subtitle}>Admissions Report — Generated {generated}</Text>

        <Text style={styles.sectionTitle}>Summary</Text>
        {[
          ["Total Applications", report.totals.applications],
          ["Accepted", report.totals.accepted],
          ["Rejected", report.totals.rejected],
          ["In Review", report.totals.inReview],
          ["Interviews Scheduled", report.totals.interviewsScheduled],
          ["Interviews Completed", report.totals.interviewsCompleted],
          ["PINs Issued", report.totals.pinsIssued],
          ["Acceptance Letters", report.totals.acceptanceLetters],
        ].map(([label, value]) => (
          <View key={String(label)} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Conversion</Text>
        {[
          ["Acceptance Rate", `${report.conversion.acceptanceRate}%`],
          ["Rejection Rate", `${report.conversion.rejectionRate}%`],
          ["Decision Completion", `${report.conversion.completionRate}%`],
        ].map(([label, value]) => (
          <View key={String(label)} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Application Status</Text>
        {report.applicationsByStatus.map((status) => (
          <View key={status.label} style={styles.row}>
            <Text style={styles.label}>{status.label}</Text>
            <Text style={styles.value}>{status.value}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Monthly Applications</Text>
        {report.monthlyApplications.map((month) => (
          <View key={month.monthLabel} style={styles.row}>
            <Text style={styles.label}>{month.monthLabel}</Text>
            <Text style={styles.value}>{month.count}</Text>
          </View>
        ))}
      </Page>

      {report.programmeBreakdown.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Top Programmes</Text>
          {report.programmeBreakdown.map((programme) => (
            <View key={programme.programmeName} style={styles.row}>
              <Text style={[styles.label, { maxWidth: "70%" }]}>
                {programme.programmeName}
              </Text>
              <Text style={styles.value}>
                {programme.count} ({programme.share}%)
              </Text>
            </View>
          ))}
        </Page>
      )}
    </Document>
  );
}
