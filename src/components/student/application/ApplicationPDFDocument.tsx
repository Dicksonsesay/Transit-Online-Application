/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ApplicationFormData, UploadedFileMeta } from "@/types/application-form";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.35,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#003e91",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#374151",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#003e91",
    marginBottom: 8,
  },
  grid2: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flexGrow: 1,
    flexBasis: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 10,
  },
  label: {
    color: "#6b7280",
    width: "40%",
  },
  value: {
    color: "#111827",
    width: "60%",
    textAlign: "right",
  },
  mono: {
    fontFamily: "Courier",
    fontSize: 10,
  },
  list: {
    marginTop: 6,
  },
  item: {
    marginBottom: 3,
  },
  photoWrap: {
    width: 70,
    height: 90,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 70,
    height: 90,
    objectFit: "cover",
  },
});

function fmtDate(input?: string) {
  if (!input) return "—";
  // expecting yyyy-mm-dd
  try {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return input;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return input;
  }
}

function labelValue(label: string, value?: string | number | null) {
  return (
    <View style={styles.row} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ? String(value) : "—"}</Text>
    </View>
  );
}

function fileMetaToLabel(meta?: UploadedFileMeta | null) {
  if (!meta) return "—";
  return meta.fileName || meta.filePath || "—";
}

function displayProgrammeLevel(level: string) {
  const map: Record<string, string> = {
    certificate: "Certificate",
    diploma: "Diploma",
    hnd: "Higher National Diploma",
    degree: "Degree",
    tc: "TC",
    htc_p: "HTC (P)",
    htc_s: "HTC(S)",
    short_professional: "Short Professional Course",
  };
  return map[level] ?? level;
}

function displayAttendance(option: string) {
  const map: Record<string, string> = {
    full_time: "Full Time",
    part_time: "Part Time",
    distance_learning: "Distance Learning",
  };
  return map[option] ?? option;
}

function displayCampus(campus: string) {
  const map: Record<string, string> = {
    magburaka: "Magburaka",
    kono: "Kono",
    other: "Other",
  };
  return map[campus] ?? campus;
}

export default function ApplicationPDFDocument({
  applicationNumber,
  studentName,
  submittedAt,
  formPayload,
  passportPhotoUrl,
}: {
  applicationNumber: string | null;
  studentName: string;
  submittedAt: Date | string;
  formPayload: ApplicationFormData;
  passportPhotoUrl?: string | null;
}) {
  const personal = (formPayload as any)?.personal ?? {};
  const enrolment = (formPayload as any)?.enrolment ?? {};
  const education = (formPayload as any)?.educationalBackground ?? [];
  const firstSitting = (formPayload as any)?.firstSitting ?? {};
  const secondSitting = (formPayload as any)?.secondSitting ?? {};
  const degrees = (formPayload as any)?.universityDegrees ?? [];
  const guardian = (formPayload as any)?.parentGuardian ?? {};
  const sponsorship = (formPayload as any)?.sponsorship ?? {};
  const documents = (formPayload as any)?.documents ?? {};
  const referees = (formPayload as any)?.referees ?? [];
  const declaration = (formPayload as any)?.declaration ?? {};

  const submittedText =
    typeof submittedAt === "string" ? fmtDate(submittedAt) : fmtDate(submittedAt.toISOString().slice(0, 10));

  const documentOther =
    documents?.other && Array.isArray(documents.other) ? documents.other : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Transit College Sierra Leone</Text>
            <Text style={styles.subtitle}>Student Admission Application Form</Text>
            {applicationNumber ? (
              <Text style={[styles.subtitle, { marginTop: 6 }]}>
                Application No: <Text style={styles.mono}>{applicationNumber}</Text>
              </Text>
            ) : null}
            <Text style={[styles.subtitle, { marginTop: 4 }]}>
              Student: {studentName}
            </Text>
            <Text style={[styles.subtitle, { marginTop: 4 }]}>
              Submitted: {submittedText}
            </Text>
          </View>

          {passportPhotoUrl ? (
            <View style={styles.photoWrap}>
              <Image src={passportPhotoUrl} style={styles.photo} />
            </View>
          ) : (
            <View style={styles.photoWrap}>
              <Text style={{ color: "#6b7280", fontSize: 9 }}>Passport Photo</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {labelValue("Surname", personal.surname)}
          {labelValue("First name", personal.firstName)}
          {labelValue("Other names", personal.otherNames)}
          {labelValue("Sex", personal.sex)}
          {labelValue("Date of birth", personal.dateOfBirth ? fmtDate(personal.dateOfBirth) : personal.dateOfBirth)}
          {labelValue("Contact number(s)", personal.contactNumbers)}
          {labelValue("Email", personal.email)}
          {labelValue("Current address", personal.currentAddress)}
          {labelValue("Permanent address", personal.permanentAddress)}
          {labelValue("District", personal.district)}
          {labelValue("Region", personal.region)}
          {labelValue("Nationality", personal.nationality)}
          {labelValue("Religion", personal.religion)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Enrolment Information</Text>
          {labelValue(
            "Programme levels",
            Array.isArray(enrolment.programmeLevels)
              ? enrolment.programmeLevels.map(displayProgrammeLevel).join(", ")
              : undefined
          )}
          {labelValue("First choice course", enrolment.firstChoiceCourse)}
          {labelValue("Second choice course", enrolment.secondChoiceCourse)}
          {labelValue(
            "Preferred attendance",
            Array.isArray(enrolment.preferredAttendance)
              ? enrolment.preferredAttendance.map(displayAttendance).join(", ")
              : undefined
          )}
          {labelValue(
            "Campus",
            enrolment.campus === "other" ? `${displayCampus(enrolment.campus)}${enrolment.campusOther ? ` (${enrolment.campusOther})` : ""}` : displayCampus(enrolment.campus)
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Educational Background</Text>
          {Array.isArray(education) && education.length ? (
            education.map((row: any, idx: number) => (
              <View key={idx} style={styles.item}>
                <Text style={{ fontWeight: 700, marginBottom: 2 }}>
                  {row.institutionName || `School ${idx + 1}`}
                </Text>
                <Text>
                  From: {row.fromYear || "—"} | To: {row.toYear || "—"} | Certificate/Degree: {row.certificateObtained || "—"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#6b7280" }}>—</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Entry Qualifications — First Sitting</Text>
          {labelValue("Examination name", firstSitting.examinationName)}
          {labelValue("Year taken", firstSitting.yearTaken)}
          {labelValue("Examination number", firstSitting.examinationNumber)}
          <View style={styles.list}>
            {(firstSitting.subjects ?? []).map((s: any, i: number) => (
              <Text key={i} style={styles.item}>
                {i + 1}. {s.subject || "—"} — Grade: {s.grade || "—"} — Year: {s.year || "—"}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Second Sitting</Text>
          {labelValue("Examination name", secondSitting.examinationName)}
          {labelValue("Year taken", secondSitting.yearTaken)}
          {labelValue("Examination number", secondSitting.examinationNumber)}
          <View style={styles.list}>
            {(secondSitting.subjects ?? []).map((s: any, i: number) => (
              <Text key={i} style={styles.item}>
                {i + 1}. {s.subject || "—"} — Grade: {s.grade || "—"} — Year: {s.year || "—"}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>University / College Degree (if applicable)</Text>
          {Array.isArray(degrees) && degrees.length ? (
            degrees.map((row: any, idx: number) => (
              <View key={idx} style={styles.item}>
                <Text style={{ fontWeight: 700, marginBottom: 2 }}>
                  {row.institution || `Institution ${idx + 1}`}
                </Text>
                <Text>
                  Degree/Certificate: {row.degreeCertificate || "—"} | Class/Division: {row.classDivision || "—"} | Date obtained: {row.dateObtained ? fmtDate(row.dateObtained) : row.dateObtained || "—"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#6b7280" }}>—</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Parent / Guardian Information</Text>
          {labelValue("Name", guardian.name)}
          {labelValue("Relationship", guardian.relationship)}
          {labelValue("Occupation", guardian.occupation)}
          {labelValue("Contact number(s)", guardian.contactNumbers)}
          {labelValue("Email", guardian.email)}
          {labelValue("Home address", guardian.homeAddress)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sponsorship Information</Text>
          {labelValue("Sponsorship", sponsorship.sponsorshipType)}
          {labelValue("Sponsor (name)", sponsorship.sponsorName)}
          {labelValue("Relationship with applicant", sponsorship.sponsorRelationship)}
          {labelValue("Occupation", sponsorship.sponsorOccupation)}
          {labelValue("Contact number(s)", sponsorship.sponsorContactNumbers)}
          {labelValue("Email", sponsorship.sponsorEmail)}
          {labelValue("Office address", sponsorship.sponsorOfficeAddress)}
          {sponsorship.sponsorshipType === "other" ? (
            <Text style={{ marginTop: 6 }}>Other: {sponsorship.sponsorshipOther}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Supporting Documents</Text>
          {labelValue("WASSCE / Testimonial", fileMetaToLabel(documents?.wassce))}
          {labelValue("Birth Certificate", fileMetaToLabel(documents?.birthCertificate))}
          {labelValue("National ID", fileMetaToLabel(documents?.nationalId))}

          {Array.isArray(documentOther) && documentOther.length ? (
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontWeight: 700, marginBottom: 4 }}>Other relevant documents</Text>
              {documentOther.map((m: any, idx: number) => (
                <Text key={idx} style={styles.item}>
                  {idx + 1}. {m.fileName || m.filePath || "—"}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={{ marginTop: 6, color: "#6b7280" }}>No other documents uploaded.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Referees</Text>
          {Array.isArray(referees) && referees.length ? (
            referees.slice(0, 2).map((ref: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: 700, marginBottom: 2 }}>Referee {idx + 1}</Text>
                {labelValue("Name", ref.name)}
                {labelValue("Telephone", ref.telephone)}
                {labelValue("Email", ref.email)}
                {labelValue("Contact address", ref.address)}
              </View>
            ))
          ) : (
            <Text style={{ color: "#6b7280" }}>—</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Declaration</Text>
          {labelValue("Declarer name", declaration.declarerName)}
          {labelValue("Agreed", declaration.agreed ? "Yes" : "No")}
          {labelValue("Signature", declaration.signature)}
          {labelValue("Date", declaration.declarationDate ? fmtDate(declaration.declarationDate) : declaration.declarationDate)}
        </View>
      </Page>
    </Document>
  );
}

