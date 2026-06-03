"use client";

import {
  emptyEducationRow,
  emptyExamSubjectRow,
  emptyRefereeRow,
  emptyUniversityDegreeRow,
} from "@/lib/application-form/defaults";
import PassportPhotoCapture from "@/components/student/application/PassportPhotoCapture";
import type {
  AttendanceOption,
  CampusOption,
  DeclarationInformation,
  EducationRow,
  EnrolmentInformation,
  ExamSitting,
  ParentGuardianInformation,
  PersonalInformation,
  ProgrammeLevelChoice,
  RefereeRow,
  SponsorshipInformation,
  SponsorshipType,
  TitleOption,
  UniversityDegreeRow,
} from "@/types/application-form";
import { PROGRAMME_CATEGORIES, PROGRAMME_LEVEL_LABELS } from "@/lib/college-programmes";
import {
  CheckboxOption,
  Field,
  inputClass,
  RadioOption,
  SectionTitle,
} from "@/components/student/application/form-ui";

const PROGRAMME_LEVEL_OPTIONS: { value: ProgrammeLevelChoice; label: string }[] =
  [
    { value: "certificate", label: "Certificate" },
    { value: "diploma", label: "Diploma" },
    { value: "hnd", label: "Higher National Diploma" },
    { value: "degree", label: "Degree" },
    { value: "tc", label: "TC" },
    { value: "htc_p", label: "HTC (P)" },
    { value: "htc_s", label: "HTC(S)" },
    { value: "short_professional", label: "Short Professional Course" },
  ];

const ATTENDANCE_OPTIONS = [
  { value: "full_time" as const, label: "Full Time" },
  { value: "part_time" as const, label: "Part Time" },
  { value: "distance_learning" as const, label: "Distance Learning" },
];

const CAMPUS_OPTIONS = [
  { value: "magburaka" as const, label: "Magburaka" },
  { value: "kono" as const, label: "Kono" },
  { value: "other" as const, label: "Other" },
];

export function PersonalSection({
  data,
  onChange,
}: {
  data: PersonalInformation;
  onChange: (data: PersonalInformation) => void;
}) {
  const set = <K extends keyof PersonalInformation>(
    key: K,
    value: PersonalInformation[K]
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <SectionTitle>Personal Information</SectionTitle>

      <Field label="Title" required>
        <div className="flex flex-wrap gap-4">
          {(
            [
              ["mr", "Mr."],
              ["mrs", "Mrs."],
              ["miss", "Miss."],
              ["other", "Others"],
            ] as const
          ).map(([value, label]) => (
            <RadioOption
              key={value}
              name="title"
              value={value}
              checked={data.title === value}
              onChange={() => set("title", value as TitleOption)}
              label={label}
            />
          ))}
        </div>
        {data.title === "other" ? (
          <input
            type="text"
            value={data.titleOther ?? ""}
            onChange={(e) => set("titleOther", e.target.value)}
            placeholder="Specify title"
            className={`${inputClass} mt-2`}
          />
        ) : null}
      </Field>

      <Field label="Surname" required>
        <input
          type="text"
          value={data.surname}
          onChange={(e) => set("surname", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="First Name" required>
        <input
          type="text"
          value={data.firstName}
          onChange={(e) => set("firstName", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Other names">
        <input
          type="text"
          value={data.otherNames ?? ""}
          onChange={(e) => set("otherNames", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Sex" required>
        <div className="flex gap-6">
          <RadioOption
            name="sex"
            value="male"
            checked={data.sex === "male"}
            onChange={() => set("sex", "male")}
            label="Male"
          />
          <RadioOption
            name="sex"
            value="female"
            checked={data.sex === "female"}
            onChange={() => set("sex", "female")}
            label="Female"
          />
        </div>
      </Field>

      <Field label="Date of birth" required>
        <input
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => set("dateOfBirth", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Contact number(s)" required>
        <input
          type="text"
          value={data.contactNumbers}
          onChange={(e) => set("contactNumbers", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Email" required>
        <input
          type="email"
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Current contact address" required>
        <textarea
          value={data.currentAddress}
          onChange={(e) => set("currentAddress", e.target.value)}
          rows={2}
          className={inputClass}
        />
      </Field>

      <Field label="Permanent contact address" required>
        <textarea
          value={data.permanentAddress}
          onChange={(e) => set("permanentAddress", e.target.value)}
          rows={2}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="District" required>
          <input
            type="text"
            value={data.district}
            onChange={(e) => set("district", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Region" required>
          <input
            type="text"
            value={data.region}
            onChange={(e) => set("region", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Nationality" required>
        <input
          type="text"
          value={data.nationality}
          onChange={(e) => set("nationality", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Religion" required>
        <input
          type="text"
          value={data.religion}
          onChange={(e) => set("religion", e.target.value)}
          className={inputClass}
        />
      </Field>

      <PassportPhotoCapture
        photoUrl={data.passportPhotoUrl}
        onUploaded={(filePath) => set("passportPhotoUrl", filePath)}
      />
    </div>
  );
}

export function SponsorshipSection({
  data,
  onChange,
}: {
  data: SponsorshipInformation;
  onChange: (data: SponsorshipInformation) => void;
}) {
  const set = <K extends keyof SponsorshipInformation>(
    key: K,
    value: SponsorshipInformation[K]
  ) => onChange({ ...data, [key]: value });

  const showSponsor = data.sponsorshipType !== "self";

  return (
    <div className="space-y-5">
      <SectionTitle>Sponsorship Information</SectionTitle>

      <Field label="Sponsorship" required>
        <div className="flex flex-col gap-2">
          {(
            [
              ["self", "Self"],
              ["parent_guardian", "Parent/Guardian"],
              ["organization", "Organization/Employee"],
              ["other", "Others"],
            ] as const
          ).map(([value, label]) => (
            <RadioOption
              key={value}
              name="sponsorship"
              value={value}
              checked={data.sponsorshipType === value}
              onChange={() => set("sponsorshipType", value as SponsorshipType)}
              label={label}
            />
          ))}
        </div>
        {data.sponsorshipType === "other" ? (
          <input
            type="text"
            value={data.sponsorshipOther ?? ""}
            onChange={(e) => set("sponsorshipOther", e.target.value)}
            placeholder="Specify"
            className={`${inputClass} mt-2`}
          />
        ) : null}
      </Field>

      {showSponsor ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm font-semibold text-[var(--primary-blue)]">
            Sponsor information (if not self-sponsored)
          </p>
          <Field label="Name" required>
            <input
              type="text"
              value={data.sponsorName ?? ""}
              onChange={(e) => set("sponsorName", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Relationship with the applicant">
            <input
              type="text"
              value={data.sponsorRelationship ?? ""}
              onChange={(e) => set("sponsorRelationship", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Occupation">
            <input
              type="text"
              value={data.sponsorOccupation ?? ""}
              onChange={(e) => set("sponsorOccupation", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Contact number(s)" required>
            <input
              type="text"
              value={data.sponsorContactNumbers ?? ""}
              onChange={(e) => set("sponsorContactNumbers", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={data.sponsorEmail ?? ""}
              onChange={(e) => set("sponsorEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Office address">
            <textarea
              value={data.sponsorOfficeAddress ?? ""}
              onChange={(e) => set("sponsorOfficeAddress", e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>
      ) : null}
    </div>
  );
}

export function ParentGuardianSection({
  data,
  onChange,
}: {
  data: ParentGuardianInformation;
  onChange: (data: ParentGuardianInformation) => void;
}) {
  const set = <K extends keyof ParentGuardianInformation>(
    key: K,
    value: ParentGuardianInformation[K]
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <SectionTitle>Parent / Guardian Information</SectionTitle>
      {(
        [
          ["name", "Name", true],
          ["relationship", "Relationship with the applicant", true],
          ["occupation", "Occupation", true],
          ["contactNumbers", "Contact number(s)", true],
          ["email", "Email", false],
          ["homeAddress", "Home address", true],
        ] as const
      ).map(([key, label, required]) => (
        <Field key={key} label={label} required={required}>
          {key === "homeAddress" ? (
            <textarea
              value={data[key]}
              onChange={(e) => set(key, e.target.value)}
              rows={2}
              className={inputClass}
            />
          ) : (
            <input
              type={key === "email" ? "email" : "text"}
              value={data[key]}
              onChange={(e) => set(key, e.target.value)}
              className={inputClass}
            />
          )}
        </Field>
      ))}
    </div>
  );
}

export function EnrolmentSection({
  data,
  onChange,
}: {
  data: EnrolmentInformation;
  onChange: (data: EnrolmentInformation) => void;
}) {
  const set = <K extends keyof EnrolmentInformation>(
    key: K,
    value: EnrolmentInformation[K]
  ) => onChange({ ...data, [key]: value });

  const catalogue = PROGRAMME_CATEGORIES.flatMap((c) => c.programmes);
  const availableLevels = Array.from(new Set(catalogue.map((p) => p.level)));
  const selectedLevel = (data.programmeLevels[0] ?? "") as ProgrammeLevelChoice | "";

  const courseOptions = selectedLevel
    ? Array.from(
        new Set(
          catalogue
            .filter((p) => p.level === selectedLevel)
            .map((p) => p.name)
        )
      ).sort((a, b) => a.localeCompare(b))
    : [];

  const toggleAttendance = (option: AttendanceOption) => {
    const next = data.preferredAttendance.includes(option)
      ? data.preferredAttendance.filter((a) => a !== option)
      : [...data.preferredAttendance, option];
    set("preferredAttendance", next);
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Enrolment Information</SectionTitle>

      <Field label="Programme" required>
        <select
          value={selectedLevel}
          onChange={(e) => {
            const next = (e.target.value ?? "") as ProgrammeLevelChoice | "";
            set("programmeLevels", next ? [next] : []);
            set("firstChoiceCourse", "");
            set("secondChoiceCourse", "");
          }}
          className={inputClass}
        >
          <option value="">Select a program</option>
          {availableLevels.map((level) => (
            <option key={level} value={level}>
              {PROGRAMME_LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="First choice: Course" required>
        <select
          value={data.firstChoiceCourse}
          onChange={(e) => set("firstChoiceCourse", e.target.value)}
          className={inputClass}
          disabled={!selectedLevel}
        >
          <option value="">
            {selectedLevel ? "Select a course" : "Select a program first"}
          </option>
          {courseOptions.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Second choice: Course">
        <select
          value={data.secondChoiceCourse}
          onChange={(e) => set("secondChoiceCourse", e.target.value)}
          className={inputClass}
          disabled={!selectedLevel}
        >
          <option value="">
            {selectedLevel ? "Select a course (optional)" : "Select a program first"}
          </option>
          {courseOptions.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Preferred attendance option" required>
        <div className="flex flex-wrap gap-4">
          {ATTENDANCE_OPTIONS.map((opt) => (
            <CheckboxOption
              key={opt.value}
              checked={data.preferredAttendance.includes(opt.value)}
              onChange={() => toggleAttendance(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </Field>

      <Field label="Campus" required>
        <div className="flex flex-wrap gap-4">
          {CAMPUS_OPTIONS.map((opt) => (
            <RadioOption
              key={opt.value}
              name="campus"
              value={opt.value}
              checked={data.campus === opt.value}
              onChange={() => set("campus", opt.value as CampusOption)}
              label={opt.label}
            />
          ))}
        </div>
        {data.campus === "other" ? (
          <input
            type="text"
            value={data.campusOther ?? ""}
            onChange={(e) => set("campusOther", e.target.value)}
            placeholder="Specify campus"
            className={`${inputClass} mt-2`}
          />
        ) : null}
      </Field>
    </div>
  );
}

function EducationTable({
  rows,
  onChange,
}: {
  rows: EducationRow[];
  onChange: (rows: EducationRow[]) => void;
}) {
  const updateRow = (index: number, patch: Partial<EducationRow>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase text-zinc-600">
              <th className="px-3 py-2">Name of institution</th>
              <th className="px-3 py-2 w-24">From</th>
              <th className="px-3 py-2 w-24">To</th>
              <th className="px-3 py-2">Certificate/Degree</th>
              <th className="px-3 py-2 w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-slate-100">
                <td className="p-2">
                  <input
                    type="text"
                    value={row.institutionName}
                    onChange={(e) =>
                      updateRow(index, { institutionName: e.target.value })
                    }
                    className={inputClass}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.fromYear}
                    onChange={(e) => updateRow(index, { fromYear: e.target.value })}
                    className={inputClass}
                    placeholder="Year"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.toYear}
                    onChange={(e) => updateRow(index, { toYear: e.target.value })}
                    className={inputClass}
                    placeholder="Year"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.certificateObtained}
                    onChange={(e) =>
                      updateRow(index, { certificateObtained: e.target.value })
                    }
                    className={inputClass}
                  />
                </td>
                <td className="p-2 text-center">
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => onChange(rows.filter((_, i) => i !== index))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, emptyEducationRow()])}
        className="text-sm font-semibold text-[var(--primary-blue)] hover:underline"
      >
        + Add institution
      </button>
    </div>
  );
}

export function EducationalBackgroundSection({
  data,
  onChange,
}: {
  data: EducationRow[];
  onChange: (data: EducationRow[]) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>Educational Background</SectionTitle>
      <p className="text-center text-sm font-medium text-zinc-600">
        Schools / institutions attended
      </p>
      <EducationTable rows={data} onChange={onChange} />
    </div>
  );
}

function ExamSittingForm({
  title,
  data,
  onChange,
  optional,
}: {
  title: string;
  data: ExamSitting;
  onChange: (data: ExamSitting) => void;
  optional?: boolean;
}) {
  const set = <K extends keyof ExamSitting>(key: K, value: ExamSitting[K]) =>
    onChange({ ...data, [key]: value });

  const updateSubject = (
    index: number,
    patch: Partial<ExamSitting["subjects"][0]>
  ) => {
    set(
      "subjects",
      data.subjects.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  };

  return (
    <div className="space-y-4">
      <SectionTitle>{title}</SectionTitle>
      {optional ? (
        <p className="text-sm text-zinc-500">
          Complete this section only if you have a second sitting.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Examination name" required={!optional}>
          <input
            type="text"
            value={data.examinationName}
            onChange={(e) => set("examinationName", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Year taken" required={!optional}>
          <input
            type="text"
            value={data.yearTaken}
            onChange={(e) => set("yearTaken", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Examination number (index number)" required={!optional}>
        <input
          type="text"
          value={data.examinationNumber}
          onChange={(e) => set("examinationNumber", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase text-zinc-600">
              <th className="w-12 px-2 py-2">S/N</th>
              <th className="px-2 py-2">Subjects</th>
              <th className="w-28 px-2 py-2">Grade</th>
              <th className="w-24 px-2 py-2">Year</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((subject, index) => (
              <tr key={index} className="border-t border-slate-100">
                <td className="px-2 py-2 text-center text-zinc-500">{index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={subject.subject}
                    onChange={(e) =>
                      updateSubject(index, { subject: e.target.value })
                    }
                    className={inputClass}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={subject.grade}
                    onChange={(e) => updateSubject(index, { grade: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={subject.year}
                    onChange={(e) => updateSubject(index, { year: e.target.value })}
                    className={inputClass}
                    placeholder={data.yearTaken}
                  />
                </td>
                <td className="p-2">
                  {data.subjects.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "subjects",
                          data.subjects.filter((_, i) => i !== index)
                        )
                      }
                      className="text-xs text-red-600"
                    >
                      ×
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() =>
          set("subjects", [...data.subjects, emptyExamSubjectRow()])
        }
        className="text-sm font-semibold text-[var(--primary-blue)] hover:underline"
      >
        + Add subject
      </button>
    </div>
  );
}

export function FirstSittingSection({
  data,
  onChange,
}: {
  data: ExamSitting;
  onChange: (data: ExamSitting) => void;
}) {
  return (
    <ExamSittingForm
      title="Entry Qualification(s) — First Sitting"
      data={data}
      onChange={onChange}
    />
  );
}

export function SecondSittingSection({
  data,
  onChange,
}: {
  data: ExamSitting;
  onChange: (data: ExamSitting) => void;
}) {
  return (
    <ExamSittingForm
      title="Second Sitting"
      data={data}
      onChange={onChange}
      optional
    />
  );
}

export function UniversityDegreesSection({
  data,
  onChange,
}: {
  data: UniversityDegreeRow[];
  onChange: (data: UniversityDegreeRow[]) => void;
}) {
  const updateRow = (index: number, patch: Partial<UniversityDegreeRow>) => {
    onChange(data.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-4">
      <SectionTitle>University or College Degree (if applicable)</SectionTitle>
      <p className="text-sm text-zinc-500">
        Leave blank if not applicable.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase text-zinc-600">
              <th className="px-3 py-2">Institution</th>
              <th className="px-3 py-2">Degree/Certificate</th>
              <th className="px-3 py-2">Class/Division</th>
              <th className="px-3 py-2">Date obtained</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-slate-100">
                {(
                  [
                    "institution",
                    "degreeCertificate",
                    "classDivision",
                    "dateObtained",
                  ] as const
                ).map((field) => (
                  <td key={field} className="p-2">
                    <input
                      type={field === "dateObtained" ? "date" : "text"}
                      value={row[field]}
                      onChange={(e) =>
                        updateRow(index, { [field]: e.target.value })
                      }
                      className={inputClass}
                    />
                  </td>
                ))}
                <td className="p-2">
                  {data.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => onChange(data.filter((_, i) => i !== index))}
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => onChange([...data, emptyUniversityDegreeRow()])}
        className="text-sm font-semibold text-[var(--primary-blue)] hover:underline"
      >
        + Add degree
      </button>
    </div>
  );
}

export function RefereesSection({
  data,
  onChange,
}: {
  data: RefereeRow[];
  onChange: (data: RefereeRow[]) => void;
}) {
  const updateReferee = (index: number, patch: Partial<RefereeRow>) => {
    onChange(data.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-6">
      <SectionTitle>Names and Addresses of two Referees</SectionTitle>
      {data.map((referee, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border border-slate-200 p-4"
        >
          <h3 className="font-semibold text-[var(--primary-blue)]">
            Referee {index + 1}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <input
                type="text"
                value={referee.name}
                onChange={(e) => updateReferee(index, { name: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Telephone number" required>
              <input
                type="text"
                value={referee.telephone}
                onChange={(e) =>
                  updateReferee(index, { telephone: e.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Email (if any)">
              <input
                type="email"
                value={referee.email}
                onChange={(e) => updateReferee(index, { email: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Contact address" required className="sm:col-span-2">
              <textarea
                value={referee.address}
                onChange={(e) =>
                  updateReferee(index, { address: e.target.value })
                }
                rows={2}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DeclarationSection({
  data,
  onChange,
}: {
  data: DeclarationInformation;
  onChange: (data: DeclarationInformation) => void;
}) {
  const set = <K extends keyof DeclarationInformation>(
    key: K,
    value: DeclarationInformation[K]
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <SectionTitle>Declaration</SectionTitle>
      <p className="text-sm leading-relaxed text-zinc-700">
        I,{" "}
        <input
          type="text"
          value={data.declarerName}
          onChange={(e) => set("declarerName", e.target.value)}
          placeholder="your full name"
          className="mx-1 inline-block min-w-[200px] border-b border-zinc-400 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[var(--primary-blue)]"
        />
        , declare that the information provided in this application form is
        accurate and complete to the best of my knowledge and I agree to receive
        communications, including text messages and phone calls at the number(s)
        provided above.
      </p>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={data.agreed}
          onChange={(e) => set("agreed", e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-[var(--primary-blue)]"
        />
        <span className="text-sm text-zinc-700">
          I have read and agree to the declaration above.
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Signature" required>
          <input
            type="text"
            value={data.signature}
            onChange={(e) => set("signature", e.target.value)}
            placeholder="Type your full name as signature"
            className={inputClass}
          />
        </Field>
        <Field label="Date" required>
          <input
            type="date"
            value={data.declarationDate}
            onChange={(e) => set("declarationDate", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}
