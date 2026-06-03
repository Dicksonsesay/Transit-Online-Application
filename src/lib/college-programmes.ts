import type { IconType } from "react-icons";
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiGlobe,
  FiHeart,
  FiLayers,
} from "react-icons/fi";

export type ProgrammeLevel =
  | "degree"
  | "diploma"
  | "hnd"
  | "certificate"
  | "tc"
  | "htc_p"
  | "htc_s";

export type ProgrammeAffiliation = "njala" | "tevet";

export type CollegeProgramme = {
  name: string;
  level: ProgrammeLevel;
  affiliation: ProgrammeAffiliation;
};

export type ProgrammeCategory = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  accentClass: string;
  iconClass: string;
  programmes: CollegeProgramme[];
};

export const PROGRAMME_LEVEL_LABELS: Record<ProgrammeLevel, string> = {
  degree: "Degree",
  diploma: "Diploma",
  hnd: "Higher National Diploma",
  certificate: "Certificate",
  tc: "Teacher Certificate (TC)",
  htc_p: "Higher Teacher Certificate – Primary (HTC P)",
  htc_s: "Higher Teacher Certificate – Secondary (HTC S)",
};

export const NJALA_AFFILIATION_INTRO =
  "The University Administration received recommendations from the Affiliation Committee to allow Transit College – SL to affiliate the following degree programmes with Njala University.";

export const TEVET_ACCREDITATION_INTRO =
  "Transit College – SL is accredited with TEVET/NCTVA to offer Higher National Diplomas, Diplomas, Higher Teacher Certificates (Primary and Secondary), Teacher Certificates, and other certificate programmes. For each related degree area, equivalent diploma pathways are available (for example, Diploma in Agriculture General alongside the BSc in Agriculture General).";

export const PROGRAMME_CATEGORIES: ProgrammeCategory[] = [
  {
    id: "agriculture",
    title: "Agriculture & Agribusiness",
    description: "Food systems, farm enterprise, and sustainable production.",
    icon: FiLayers,
    accentClass: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    iconClass: "bg-emerald-600 text-white",
    programmes: [
      {
        name: "Bachelor of Science in Agriculture General",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Bachelor of Science in Agribusiness",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Diploma in Agriculture General",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Diploma in Agribusiness",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Higher National Diploma in Agriculture General",
        level: "hnd",
        affiliation: "tevet",
      },
    ],
  },
  {
    id: "environment",
    title: "Environment & Quality",
    description: "Environmental stewardship, health standards, and compliance.",
    icon: FiGlobe,
    accentClass: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50",
    iconClass: "bg-sky-600 text-white",
    programmes: [
      {
        name: "Bachelor of Science in Environmental Management and Quality Control",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Bachelor of Science with Honours in Environmental Health and Sanitation",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Diploma in Environmental Management and Quality Control",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Diploma in Environmental Health and Sanitation",
        level: "diploma",
        affiliation: "tevet",
      },
    ],
  },
  {
    id: "health",
    title: "Public Health",
    description: "Community wellness and population health leadership.",
    icon: FiHeart,
    accentClass: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50",
    iconClass: "bg-rose-600 text-white",
    programmes: [
      {
        name: "Bachelor of Science in Public Health",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Diploma in Public Health",
        level: "diploma",
        affiliation: "tevet",
      },
    ],
  },
  {
    id: "communication-education",
    title: "Communication & Education",
    description: "Media, development communication, and teacher preparation.",
    icon: FiBookOpen,
    accentClass:
      "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
    iconClass: "bg-violet-600 text-white",
    programmes: [
      {
        name: "Bachelor of Arts in Development Communication and Media Studies",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Bachelor of Education (Community Development Studies and Early Childhood Education)",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Diploma in Development Communication and Media Studies",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Diploma in Education (Community Development Studies and Early Childhood Education)",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Higher Teacher Certificate (Primary)",
        level: "htc_p",
        affiliation: "tevet",
      },
      {
        name: "Higher Teacher Certificate (Secondary)",
        level: "htc_s",
        affiliation: "tevet",
      },
      {
        name: "Teacher Certificate",
        level: "tc",
        affiliation: "tevet",
      },
    ],
  },
  {
    id: "business",
    title: "Business & Finance",
    description: "Accounting, management, and organisational leadership.",
    icon: FiBriefcase,
    accentClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
    iconClass: "bg-amber-600 text-white",
    programmes: [
      {
        name: "Bachelor of Science with Honours in Accounting and Finance",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Bachelor of Science with Honours in Business Administration and Management",
        level: "degree",
        affiliation: "njala",
      },
      {
        name: "Diploma in Accounting and Finance",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Diploma in Business Administration and Management",
        level: "diploma",
        affiliation: "tevet",
      },
      {
        name: "Higher National Diploma in Business Administration and Management",
        level: "hnd",
        affiliation: "tevet",
      },
    ],
  },
  {
    id: "certificates",
    title: "Certificate & Professional Programmes",
    description: "Short-cycle and professional qualifications through TEVET/NCTVA.",
    icon: FiAward,
    accentClass: "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50",
    iconClass: "bg-indigo-600 text-white",
    programmes: [
      {
        name: "Certificate in Information Technology",
        level: "certificate",
        affiliation: "tevet",
      },
      {
        name: "Certificate in Community Development",
        level: "certificate",
        affiliation: "tevet",
      },
      {
        name: "Certificate in Environmental Health",
        level: "certificate",
        affiliation: "tevet",
      },
      {
        name: "Other Certificate Programmes (as approved by TEVET/NCTVA)",
        level: "certificate",
        affiliation: "tevet",
      },
    ],
  },
];

export const ALL_COLLEGE_PROGRAMMES = PROGRAMME_CATEGORIES.flatMap(
  (category) => category.programmes
);

export const ALL_AFFILIATED_PROGRAMMES = ALL_COLLEGE_PROGRAMMES.filter(
  (programme) => programme.affiliation === "njala"
).map((programme) => programme.name);

export const ALL_TEVET_PROGRAMMES = ALL_COLLEGE_PROGRAMMES.filter(
  (programme) => programme.affiliation === "tevet"
);

export const ALL_COLLEGE_PROGRAMME_NAMES = ALL_COLLEGE_PROGRAMMES.map(
  (programme) => programme.name
);

const LEVEL_DURATION: Record<ProgrammeLevel, string> = {
  degree: "4 Years",
  diploma: "3 Years",
  hnd: "2 Years",
  certificate: "1 Year",
  tc: "2 Years",
  htc_p: "3 Years",
  htc_s: "3 Years",
};

export type ProgrammeSeedEntry = {
  programmeName: string;
  department: string;
  duration: string;
};

export const PROGRAMME_SEED_ENTRIES: ProgrammeSeedEntry[] = PROGRAMME_CATEGORIES.flatMap(
  (category) =>
    category.programmes.map((programme) => ({
      programmeName: programme.name,
      department: category.title,
      duration: LEVEL_DURATION[programme.level],
    }))
);
