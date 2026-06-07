import Image from "next/image";
import Link from "next/link";
import ApplicantStatusControl from "@/components/admin/ApplicantStatusControl";
import { DetailField, DetailGrid, DetailSection } from "@/components/admin/DetailBlocks";
import {
  displayValue,
  formatAttendance,
  formatCampus,
  formatProgrammeLevel,
  formatSponsorshipType,
  formatTitle,
} from "@/lib/application-form-display";
import { applicationStatusLabel } from "@/lib/application-status";
import type { ApplicantDetail } from "@/lib/admin-applicants";
import { toStudentFileDisplayUrl } from "@/lib/student-file-url";
import { formatDate } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@/types/application-form";

const DOCUMENT_LABELS: Record<string, string> = {
  wassce: DOCUMENT_TYPE_LABELS.wassce,
  birth_certificate: DOCUMENT_TYPE_LABELS.birth_certificate,
  national_id: DOCUMENT_TYPE_LABELS.national_id,
  other: DOCUMENT_TYPE_LABELS.other,
};

type ApplicantDetailViewProps = {
  applicant: ApplicantDetail;
};

export default function ApplicantDetailView({ applicant }: ApplicantDetailViewProps) {
  const { formData: data } = applicant;
  const personal = data.personal;
  const enrolment = data.enrolment;
  const guardian = data.parentGuardian;
  const sponsorship = data.sponsorship;
  const documents = data.documents;
  const fileUrl = toStudentFileDisplayUrl;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex gap-4">
          {applicant.passportPhoto ? (
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200">
              <Image
                src={toStudentFileDisplayUrl(applicant.passportPhoto)}
                alt={applicant.fullname}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}
          <div>
            <h2 className="text-xl font-bold text-[var(--primary-blue)]">
              {applicant.fullname}
            </h2>
            {applicant.applicationNumber ? (
              <p className="mt-1 text-sm text-zinc-600">
                Application No:{" "}
                <span className="font-semibold">{applicant.applicationNumber}</span>
              </p>
            ) : null}
            <p className="mt-1 text-sm text-zinc-600">
              Submitted {formatDate(applicant.submittedAt)} ·{" "}
              <span className="font-medium">
                {applicationStatusLabel[applicant.applicationStatus]}
              </span>
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {applicant.programmeName} ({applicant.programmeDepartment})
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <ApplicantStatusControl
            studentId={applicant.studentId}
            currentStatus={applicant.applicationStatus}
          />
          <a
            href={`/api/admin/applicants/${applicant.studentId}/pdf`}
            className="text-sm font-semibold text-[var(--primary-blue)] hover:underline"
          >
            Download application PDF
          </a>
        </div>
      </div>

      {personal ? (
        <DetailSection title="Personal Information">
          <DetailGrid>
            <DetailField
              label="Title"
              value={formatTitle(personal.title, personal.titleOther)}
            />
            <DetailField label="Surname" value={displayValue(personal.surname)} />
            <DetailField label="First name" value={displayValue(personal.firstName)} />
            <DetailField label="Other names" value={displayValue(personal.otherNames)} />
            <DetailField label="Sex" value={displayValue(personal.sex)} />
            <DetailField
              label="Date of birth"
              value={personal.dateOfBirth ? formatDate(personal.dateOfBirth) : "—"}
            />
            <DetailField label="Contact number(s)" value={displayValue(personal.contactNumbers)} />
            <DetailField label="Email" value={displayValue(personal.email)} />
            <DetailField label="District" value={displayValue(personal.district)} />
            <DetailField label="Region" value={displayValue(personal.region)} />
            <DetailField label="Nationality" value={displayValue(personal.nationality)} />
            <DetailField label="Religion" value={displayValue(personal.religion)} />
          </DetailGrid>
          <DetailField label="Current contact address" value={displayValue(personal.currentAddress)} />
          <DetailField label="Permanent contact address" value={displayValue(personal.permanentAddress)} />
        </DetailSection>
      ) : null}

      {enrolment ? (
        <DetailSection title="Enrolment Information">
          <DetailField
            label="Programme levels"
            value={
              enrolment.programmeLevels.length
                ? enrolment.programmeLevels.map(formatProgrammeLevel).join(", ")
                : "—"
            }
          />
          <DetailGrid>
            <DetailField label="First choice course" value={displayValue(enrolment.firstChoiceCourse)} />
            <DetailField label="Second choice course" value={displayValue(enrolment.secondChoiceCourse)} />
            <DetailField
              label="Preferred attendance"
              value={
                enrolment.preferredAttendance.length
                  ? enrolment.preferredAttendance.map(formatAttendance).join(", ")
                  : "—"
              }
            />
            <DetailField
              label="Campus"
              value={formatCampus(enrolment.campus, enrolment.campusOther)}
            />
          </DetailGrid>
        </DetailSection>
      ) : null}

      {data.educationalBackground?.length ? (
        <DetailSection title="Educational Background">
          {data.educationalBackground.map((row, idx) => (
            <div key={idx} className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-[var(--primary-blue)]">
                {displayValue(row.institutionName)}
              </p>
              <p className="mt-1 text-zinc-600">
                {displayValue(row.fromYear)} – {displayValue(row.toYear)} ·{" "}
                {displayValue(row.certificateObtained)}
              </p>
            </div>
          ))}
        </DetailSection>
      ) : null}

      {data.firstSitting ? (
        <DetailSection title="Entry Qualifications — First Sitting">
          <DetailGrid>
            <DetailField label="Examination" value={displayValue(data.firstSitting.examinationName)} />
            <DetailField label="Year" value={displayValue(data.firstSitting.yearTaken)} />
            <DetailField label="Index number" value={displayValue(data.firstSitting.examinationNumber)} />
          </DetailGrid>
          {(data.firstSitting.subjects ?? []).map((s, i) => (
            <p key={i} className="text-sm text-zinc-700">
              {s.subject || "—"} — Grade {s.grade || "—"} ({s.year || "—"})
            </p>
          ))}
        </DetailSection>
      ) : null}

      {data.secondSitting &&
      (data.secondSitting.examinationName ||
        data.secondSitting.subjects?.some((s) => s.subject?.trim())) ? (
        <DetailSection title="Second Sitting">
          <DetailGrid>
            <DetailField label="Examination" value={displayValue(data.secondSitting.examinationName)} />
            <DetailField label="Year" value={displayValue(data.secondSitting.yearTaken)} />
            <DetailField label="Index number" value={displayValue(data.secondSitting.examinationNumber)} />
          </DetailGrid>
          {(data.secondSitting.subjects ?? []).map((s, i) => (
            <p key={i} className="text-sm text-zinc-700">
              {s.subject || "—"} — Grade {s.grade || "—"} ({s.year || "—"})
            </p>
          ))}
        </DetailSection>
      ) : null}

      {data.universityDegrees?.some((d) => d.institution?.trim()) ? (
        <DetailSection title="University / College Degree">
          {data.universityDegrees.map((row, idx) => (
            <div key={idx} className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-semibold">{displayValue(row.institution)}</p>
              <p className="mt-1 text-zinc-600">
                {displayValue(row.degreeCertificate)} · {displayValue(row.classDivision)} ·{" "}
                {row.dateObtained ? formatDate(row.dateObtained) : "—"}
              </p>
            </div>
          ))}
        </DetailSection>
      ) : null}

      {guardian ? (
        <DetailSection title="Parent / Guardian Information">
          <DetailGrid>
            <DetailField label="Name" value={displayValue(guardian.name)} />
            <DetailField label="Relationship" value={displayValue(guardian.relationship)} />
            <DetailField label="Occupation" value={displayValue(guardian.occupation)} />
            <DetailField label="Contact" value={displayValue(guardian.contactNumbers)} />
            <DetailField label="Email" value={displayValue(guardian.email)} />
          </DetailGrid>
          <DetailField label="Home address" value={displayValue(guardian.homeAddress)} />
        </DetailSection>
      ) : null}

      {sponsorship ? (
        <DetailSection title="Sponsorship Information">
          <DetailField
            label="Sponsorship"
            value={formatSponsorshipType(
              sponsorship.sponsorshipType,
              sponsorship.sponsorshipOther
            )}
          />
          {sponsorship.sponsorshipType !== "self" ? (
            <DetailGrid>
              <DetailField label="Sponsor name" value={displayValue(sponsorship.sponsorName)} />
              <DetailField label="Relationship" value={displayValue(sponsorship.sponsorRelationship)} />
              <DetailField label="Occupation" value={displayValue(sponsorship.sponsorOccupation)} />
              <DetailField label="Contact" value={displayValue(sponsorship.sponsorContactNumbers)} />
              <DetailField label="Email" value={displayValue(sponsorship.sponsorEmail)} />
            </DetailGrid>
          ) : null}
          {sponsorship.sponsorOfficeAddress ? (
            <DetailField label="Office address" value={displayValue(sponsorship.sponsorOfficeAddress)} />
          ) : null}
        </DetailSection>
      ) : null}

      <DetailSection title="Supporting Documents">
        <DetailGrid>
          <DetailField
            label="WASSCE / Testimonial"
            value={
              documents?.wassce ? (
                <Link href={fileUrl(documents.wassce.filePath)} target="_blank" className="text-[var(--primary-blue)] hover:underline">
                  {documents.wassce.fileName}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <DetailField
            label="Birth Certificate"
            value={
              documents?.birthCertificate ? (
                <Link href={fileUrl(documents.birthCertificate.filePath)} target="_blank" className="text-[var(--primary-blue)] hover:underline">
                  {documents.birthCertificate.fileName}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <DetailField
            label="National ID"
            value={
              documents?.nationalId ? (
                <Link href={fileUrl(documents.nationalId.filePath)} target="_blank" className="text-[var(--primary-blue)] hover:underline">
                  {documents.nationalId.fileName}
                </Link>
              ) : (
                "—"
              )
            }
          />
        </DetailGrid>
        {documents?.other?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-zinc-500">Other documents</p>
            {documents.other.map((doc, i) => (
              <Link
                key={i}
                href={fileUrl(doc.filePath)}
                target="_blank"
                className="block text-sm text-[var(--primary-blue)] hover:underline"
              >
                {doc.fileName}
              </Link>
            ))}
          </div>
        ) : null}
        {applicant.uploadedDocuments.length ? (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium uppercase text-zinc-500">All uploads on file</p>
            {applicant.uploadedDocuments.map((doc, i) => (
              <div key={i} className="flex justify-between gap-2 text-sm">
                <Link href={fileUrl(doc.filePath)} target="_blank" className="text-[var(--primary-blue)] hover:underline">
                  {DOCUMENT_LABELS[doc.documentType] ?? doc.documentType}
                </Link>
                <span className="text-zinc-400">{formatDate(doc.uploadedAt)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </DetailSection>

      {data.referees?.length ? (
        <DetailSection title="Referees">
          {data.referees.map((ref, idx) => (
            <div key={idx} className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-[var(--primary-blue)]">Referee {idx + 1}</p>
              <DetailGrid>
                <DetailField label="Name" value={displayValue(ref.name)} />
                <DetailField label="Telephone" value={displayValue(ref.telephone)} />
                <DetailField label="Email" value={displayValue(ref.email)} />
              </DetailGrid>
              <DetailField label="Address" value={displayValue(ref.address)} />
            </div>
          ))}
        </DetailSection>
      ) : null}

      {data.declaration ? (
        <DetailSection title="Declaration">
          <DetailGrid>
            <DetailField label="Declarer name" value={displayValue(data.declaration.declarerName)} />
            <DetailField label="Signature" value={displayValue(data.declaration.signature)} />
            <DetailField
              label="Date"
              value={
                data.declaration.declarationDate
                  ? formatDate(data.declaration.declarationDate)
                  : "—"
              }
            />
            <DetailField
              label="Agreed"
              value={data.declaration.agreed ? "Yes" : "No"}
            />
          </DetailGrid>
        </DetailSection>
      ) : null}

      <Link
        href="/admin/applicants"
        className="inline-flex text-sm font-semibold text-[var(--primary-blue)] hover:underline"
      >
        ← Back to all applicants
      </Link>
    </div>
  );
}
