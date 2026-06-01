import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatDateLong } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingHorizontal: 42,
    paddingBottom: 32,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#111827",
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brand: {
    maxWidth: "70%",
  },
  collegeName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#003e91",
    lineHeight: 1.2,
  },
  tagline: {
    marginTop: 3,
    color: "#374151",
    fontSize: 9,
    textTransform: "uppercase",
  },
  dateBlock: {
    textAlign: "right",
    fontSize: 10,
    color: "#374151",
  },
  letterRef: {
    marginTop: 2,
    fontSize: 9,
    color: "#6b7280",
  },
  body: {
    marginTop: 28,
  },
  greeting: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: 600,
  },
  paragraph: {
    marginBottom: 12,
  },
  detailsBox: {
    borderRadius: 6,
    border: "1px solid #d1d5db",
    padding: 12,
    marginBottom: 14,
  },
  detailLine: {
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: 700,
    color: "#1f2937",
  },
  signatureBlock: {
    marginTop: 30,
  },
  signatureLine: {
    width: 110,
    borderTop: "1px solid #111827",
    marginBottom: 4,
  },
  seal: {
    position: "absolute",
    right: 48,
    top: 275,
    width: 96,
    height: 96,
    borderRadius: 48,
    border: "2px solid #d1d5db",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: 10,
    textAlign: "center",
    opacity: 0.55,
  },
  footerBar: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: 14,
    backgroundColor: "#f1c40f",
  },
});

type AcceptanceLetterPDFDocumentProps = {
  letterReference: string;
  date: Date | string;
  studentName: string;
  programmeName: string;
  courseName: string;
  admissionYear: string;
};

export default function AcceptanceLetterPDFDocument({
  letterReference,
  date,
  studentName,
  programmeName,
  courseName,
  admissionYear,
}: AcceptanceLetterPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            <Text style={styles.collegeName}>TRANSIT COLLEGE{"\n"}SIERRA LEONE</Text>
            <Text style={styles.tagline}>Transformation for Excellence</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text>Date: {formatDateLong(date)}</Text>
            <Text style={styles.letterRef}>Ref: {letterReference}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.greeting}>Dear {studentName},</Text>

          <Text style={styles.paragraph}>
            We are pleased to inform you that you have been offered admission into
            Transit College Sierra Leone for the {admissionYear} Academic Year.
          </Text>

          <View style={styles.detailsBox}>
            <Text style={styles.detailLine}>
              <Text style={styles.detailLabel}>Programme:</Text> {programmeName}
            </Text>
            <Text style={styles.detailLine}>
              <Text style={styles.detailLabel}>Course:</Text> {courseName}
            </Text>
            <Text>
              <Text style={styles.detailLabel}>Admission Year:</Text> {admissionYear}
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Congratulations and welcome to the Transit College family.
          </Text>

          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text>Registrar</Text>
          </View>
        </View>

        <View style={styles.seal}>
          <Text>TRANSIT{"\n"}OFFICIAL{"\n"}SEAL</Text>
        </View>
        <View style={styles.footerBar} />
      </Page>
    </Document>
  );
}
