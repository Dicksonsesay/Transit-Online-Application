"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import AdminProfileForm from "@/components/account/AdminProfileForm";
import ProfileAccountSummary from "@/components/account/ProfileAccountSummary";
import ProfileDetailCard from "@/components/account/ProfileDetailCard";
import ProfileHero from "@/components/account/ProfileHero";
import ProfileSecurityCard from "@/components/account/ProfileSecurityCard";

type AdminProfilePanelProps = {
  details: {
    fullname: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    created: string;
  };
  formAdmin: {
    fullname: string;
    email: string;
    phone: string;
  };
};

export default function AdminProfilePanel({
  details,
  formAdmin,
}: AdminProfilePanelProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <ProfileHero
          fullname={details.fullname}
          subtitle={details.email}
          portalLabel="Admin Portal"
          badges={[
            { label: "role", value: details.role },
            { label: "status", value: details.status },
          ]}
        />
        <AdminProfileForm
          admin={formAdmin}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <ProfileHero
        fullname={details.fullname}
        subtitle={details.email}
        portalLabel="Admin Portal"
        badges={[
          { label: "role", value: details.role },
          { label: "status", value: details.status },
        ]}
        onEdit={() => setEditing(true)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileDetailCard
            title="Contact information"
            description="How colleagues and applicants can reach you."
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
            ]}
          />
        </div>

        <div className="space-y-6">
          <ProfileAccountSummary
            items={[
              { label: "Role", value: details.role },
              { label: "Status", value: details.status, showBadge: true },
            ]}
            memberSince={details.created}
          />
          <ProfileSecurityCard changePasswordHref="/admin/change-password" />
        </div>
      </div>
    </div>
  );
}
