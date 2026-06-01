import type { IconType } from "react-icons";
import {
  FiAward,
  FiBookOpen,
  FiClipboard,
  FiFileText,
  FiLayers,
  FiUserCheck,
} from "react-icons/fi";

export type RequirementItem = {
  title: string;
  points: string[];
};

export type ProgrammeLevelRequirement = {
  level: string;
  affiliation: string;
  summary: string;
  requirements: string[];
  accentClass: string;
};

export const GENERAL_ELIGIBILITY: RequirementItem[] = [
  {
    title: "Who may apply",
    points: [
      "Sierra Leonean citizens and international applicants are welcome.",
      "Applicants must meet the academic and age requirements for their chosen programme level.",
      "Each applicant may indicate a first and second choice of course during enrolment.",
    ],
  },
  {
    title: "Before you start",
    points: [
      "Pay the admission fee at the designated bank and obtain your official receipt.",
      "Collect your unique admission PIN from the bank immediately after payment.",
      "Verify your PIN on this portal before creating a student account.",
    ],
  },
];

export const PROGRAMME_LEVEL_REQUIREMENTS: ProgrammeLevelRequirement[] = [
  {
    level: "Degree (Njala University affiliation)",
    affiliation: "Njala University",
    summary:
      "For bachelor programmes affiliated with Njala University—including Agriculture, Public Health, Business, Education, and related fields.",
    requirements: [
      "WASSCE, GCE Advanced Level, or an equivalent qualification recognised by Njala University.",
      "Credit passes (grade C6 or better) in at least five subjects, including English Language and Mathematics.",
      "Relevant science or arts subjects depending on the programme applied for (e.g. Biology/Agricultural Science for Agriculture; Economics/Accounts for Business).",
      "Satisfactory aggregate score as determined by the admissions committee for the intake year.",
      "Mature candidates with relevant diplomas or professional experience may be considered under the mature entry route, subject to university approval.",
    ],
    accentClass: "border-[var(--primary-blue)]/30 bg-blue-50/50",
  },
  {
    level: "Higher National Diploma (HND)",
    affiliation: "TEVET/NCTVA",
    summary:
      "For HND pathways in Agriculture, Business Administration, and related technical fields.",
    requirements: [
      "WASSCE or GBCE with credit passes in at least four subjects, including English Language.",
      "Credit pass in Mathematics for Business and technical programmes.",
      "Relevant subject credits aligned with the chosen HND area of study.",
      "Holders of a relevant NCTVA Diploma may apply for advanced placement where applicable.",
    ],
    accentClass: "border-emerald-200 bg-emerald-50/50",
  },
  {
    level: "Diploma",
    affiliation: "TEVET/NCTVA",
    summary:
      "Diploma programmes are available in the same fields as affiliated degree areas—for example, Diploma in Agriculture General alongside the BSc in Agriculture General.",
    requirements: [
      "WASSCE or GBCE with at least five passes, including English Language.",
      "Credit or pass grades in subjects relevant to the chosen diploma programme.",
      "Applicants with a Teacher Certificate (TC) or equivalent may be considered for certain diploma pathways.",
      "Mature applicants with verified work experience in the field may be assessed on merit.",
    ],
    accentClass: "border-emerald-200 bg-emerald-50/50",
  },
  {
    level: "Higher Teacher Certificate (HTC) — Primary & Secondary",
    affiliation: "TEVET/NCTVA",
    summary:
      "For candidates preparing to teach at primary (HTC P) or secondary (HTC S) level in the education sector.",
    requirements: [
      "WASSCE or GBCE with credit passes in at least five subjects, including English Language.",
      "Credit passes in relevant teaching subjects (e.g. Mathematics, Integrated Science, Social Studies, or a language).",
      "For HTC (Secondary), credits in at least two subjects in the intended teaching area.",
      "Evidence of good conduct and suitability for the teaching profession.",
    ],
    accentClass: "border-violet-200 bg-violet-50/50",
  },
  {
    level: "Teacher Certificate (TC)",
    affiliation: "TEVET/NCTVA",
    summary: "Entry-level teacher preparation programme under TEVET/NCTVA.",
    requirements: [
      "BECE or WASSCE with passes in English Language and at least three other subjects.",
      "Basic literacy and numeracy competency.",
      "Applicants must demonstrate interest and aptitude for teaching.",
    ],
    accentClass: "border-violet-200 bg-violet-50/50",
  },
  {
    level: "Certificate programmes",
    affiliation: "TEVET/NCTVA",
    summary:
      "Short-cycle and professional certificate programmes, including Information Technology, Community Development, and other approved certificates.",
    requirements: [
      "BECE, WASSCE, or equivalent basic education certificate.",
      "Some professional certificates may accept mature applicants based on work experience without formal examination results.",
      "Specific prerequisites may apply depending on the certificate programme—contact admissions for details.",
    ],
    accentClass: "border-indigo-200 bg-indigo-50/50",
  },
];

export const REQUIRED_DOCUMENTS: RequirementItem[] = [
  {
    title: "Academic records",
    points: [
      "WASSCE / GBCE / GCE results slip or certified testimonial.",
      "Transcripts or certificates from previous institutions (if applicable).",
      "Evidence of any additional qualifications (diploma, certificate, or professional training).",
    ],
  },
  {
    title: "Identity & personal records",
    points: [
      "Birth certificate or sworn affidavit of age.",
      "National ID, voter ID, or valid passport.",
      "Recent passport-size photograph (uploaded during the online application).",
    ],
  },
  {
    title: "Supporting documents",
    points: [
      "Sponsorship or guardian information (if not self-sponsored).",
      "Referee details as requested in the application form.",
      "Any other documents specified by admissions for your programme level.",
    ],
  },
];

export const APPLICATION_NOTES: string[] = [
  "Meeting the minimum requirements does not guarantee admission. Selection is based on available places, interview performance, and programme-specific criteria.",
  "Incomplete applications or missing documents may delay processing or lead to rejection.",
  "All uploaded documents must be clear, legible, and authentic. Falsified documents will result in disqualification.",
  "International qualifications must be evaluated and equated by the relevant national or university body before admission is confirmed.",
  "Requirements may be updated by Njala University or TEVET/NCTVA for each academic year. The admissions office will communicate any changes.",
];

export const REQUIREMENT_QUICK_LINKS: {
  title: string;
  description: string;
  href: string;
  icon: IconType;
}[] = [
  {
    title: "Browse programmes",
    description: "View all Njala University and TEVET/NCTVA pathways.",
    href: "/programs",
    icon: FiLayers,
  },
  {
    title: "How to apply",
    description: "Step-by-step guide from payment to submission.",
    href: "/how-to-apply",
    icon: FiClipboard,
  },
  {
    title: "Verify your PIN",
    description: "Start your application after paying at the bank and collecting your PIN.",
    href: "/auth/verify-pin",
    icon: FiUserCheck,
  },
];

export const REQUIREMENT_SECTION_ICONS = {
  general: FiUserCheck,
  academic: FiBookOpen,
  documents: FiFileText,
  notes: FiAward,
} as const;
