"use client";

import { useState } from "react";
import {
  FiCalendar,
  FiGlobe,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import StudentProfileForm from "@/components/account/StudentProfileForm";
import ProfileAccountSummary from "@/components/account/ProfileAccountSummary";
import ProfileDetailCard from "@/components/account/ProfileDetailCard";
import ProfileHero from "@/components/account/ProfileHero";
import ProfileSecurityCard from "@/components/account/ProfileSecurityCard";
import { formatProfileLabel } from "@/lib/profile-display";

type StudentProfilePanelProps = {
  hasPassword?: boolean;
  details: {
    applicationNumber: string;
    fullname: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    accountStatus: string;
    joined: string;
  };
  formStudent: {
    fullname: string;
    email: string;
    gender: string | null;
    dateOfBirth: string;
    phone: string;
    address: string;
    nationality: string;
  };
};

export default function StudentProfilePanel({
  hasPassword = true,
  details,
  formStudent,
}: StudentProfilePanelProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <ProfileHero
          fullname={details.fullname}
          subtitle={details.email}
          portalLabel="Student Portal"
          badges={[{ label: "status", value: details.accountStatus }]}
        />
        <StudentProfileForm
          student={formStudent}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <ProfileHero
        fullname={details.fullname}
        subtitle={details.email}
        portalLabel="Student Portal"
        badges={[{ label: "status", value: details.accountStatus }]}
        onEdit={() => setEditing(true)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileDetailCard
            title="Personal information"
            description="Your contact and identity details on file."
            items={[
              {
                label: "Full name",
                value: details.fullname,
                icon: FiUser,
                iconClass: "bg-blue-100 text-blue-700",
              },
              {
                label: "Email address",
                value: details.email,
                icon: FiMail,
                iconClass: "bg-sky-100 text-sky-700",
              },
              {
                label: "Phone number",
                value: details.phone,
                icon: FiPhone,
                iconClass: "bg-violet-100 text-violet-700",
              },
              {
                label: "Gender",
                value: formatProfileLabel(details.gender),
                icon: FiUser,
                iconClass: "bg-indigo-100 text-indigo-700",
              },
              {
                label: "Date of birth",
                value: details.dateOfBirth,
                icon: FiCalendar,
                iconClass: "bg-amber-100 text-amber-700",
              },
              {
                label: "Nationality",
                value: details.nationality,
                icon: FiGlobe,
                iconClass: "bg-teal-100 text-teal-700",
              },
              {
                label: "Address",
                value: details.address,
                icon: FiMapPin,
                iconClass: "bg-rose-100 text-rose-700",
                fullWidth: true,
              },
            ]}
          />

          <ProfileDetailCard
            title="Admission record"
            description="Identifiers linked to your application."
            items={[
              {
                label: "Application number",
                value: details.applicationNumber,
                icon: FiHash,
                iconClass: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]",
              },
              {
                label: "Account status",
                value: formatProfileLabel(details.accountStatus),
                icon: FiUser,
                iconClass: "bg-emerald-100 text-emerald-700",
              },
            ]}
          />
        </div>

        <div className="space-y-6">
          <ProfileAccountSummary
            items={[
              { label: "Account status", value: details.accountStatus, showBadge: true },
            ]}
            memberSince={details.joined}
          />
          <ProfileSecurityCard
            changePasswordHref="/student/change-password"
            hasPassword={hasPassword}
          />
        </div>
      </div>
    </div>
  );
}
