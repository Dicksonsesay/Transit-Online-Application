"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  saveApplicationSectionAction,
  submitApplicationAction,
} from "@/actions/application-form";
import ApplicationProgress from "@/components/student/application/ApplicationProgress";
import StudentPageHero from "@/components/student/ui/StudentPageHero";
import { FiFileText } from "react-icons/fi";
import DocumentsSection from "@/components/student/application/DocumentsSection";
import {
  DeclarationSection,
  EducationalBackgroundSection,
  EnrolmentSection,
  FirstSittingSection,
  ParentGuardianSection,
  PersonalSection,
  RefereesSection,
  SecondSittingSection,
  SponsorshipSection,
  UniversityDegreesSection,
} from "@/components/student/application/sections";
import { FormActions, FormError } from "@/components/student/application/form-ui";
import { emptyDocuments, mergeFormData } from "@/lib/application-form/defaults";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import {
  APPLICATION_SECTION_COUNT,
  type ApplicationDocuments,
  type ApplicationFormData,
  type DeclarationInformation,
  type EnrolmentInformation,
  type ParentGuardianInformation,
  type PersonalInformation,
  type SponsorshipInformation,
} from "@/types/application-form";

type ApplicationWizardProps = {
  initialSection: number;
  initialData: ApplicationFormData;
};

const emptyPersonal = (): PersonalInformation => ({
  title: "mr",
  surname: "",
  firstName: "",
  sex: "male",
  dateOfBirth: "",
  contactNumbers: "",
  email: "",
  currentAddress: "",
  permanentAddress: "",
  district: "",
  region: "",
  nationality: "",
  religion: "",
});

const emptyEnrolment = (): EnrolmentInformation => ({
  programmeLevels: [],
  firstChoiceCourse: "",
  secondChoiceCourse: "",
  preferredAttendance: [],
  campus: "magburaka",
});

const emptySponsorship = (): SponsorshipInformation => ({
  sponsorshipType: "self",
});

const emptyParentGuardian = (): ParentGuardianInformation => ({
  name: "",
  relationship: "",
  occupation: "",
  contactNumbers: "",
  email: "",
  homeAddress: "",
});

const emptyDeclaration = (): DeclarationInformation => ({
  declarerName: "",
  agreed: false,
  signature: "",
  declarationDate: new Date().toISOString().slice(0, 10),
});

export default function ApplicationWizard({
  initialSection,
  initialData,
}: ApplicationWizardProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(
    Math.min(initialSection, APPLICATION_SECTION_COUNT)
  );
  const [formData, setFormData] = useState<ApplicationFormData>(() =>
    mergeFormData(initialData)
  );
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const isLastSection = currentSection === APPLICATION_SECTION_COUNT;

  function getSectionPayload(section: number): unknown {
    const merged = mergeFormData(formData);
    switch (section) {
      case 1:
        return merged.personal ?? emptyPersonal();
      case 2:
        return merged.enrolment ?? emptyEnrolment();
      case 3:
        return merged.educationalBackground;
      case 4:
        return merged.firstSitting;
      case 5:
        return merged.secondSitting;
      case 6:
        return merged.universityDegrees;
      case 7:
        return merged.parentGuardian ?? emptyParentGuardian();
      case 8:
        return merged.sponsorship ?? emptySponsorship();
      case 9:
        return merged.documents ?? emptyDocuments();
      case 10:
        return merged.referees;
      case 11:
        return merged.declaration ?? emptyDeclaration();
      default:
        return {};
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    const payload = getSectionPayload(currentSection);

    startTransition(async () => {
      if (isLastSection) {
        const confirm = await confirmAction(
          "Submit application?",
          "You will not be able to edit the form after submission."
        );
        if (!confirm.isConfirmed) return;

        const merged = mergeFormData({
          ...formData,
          declaration: payload as DeclarationInformation,
        });

        const saveResult = await saveApplicationSectionAction(
          currentSection,
          payload,
          "stay"
        );
        if (saveResult.error) {
          setError(saveResult.error);
          return;
        }

        const submitResult = await submitApplicationAction(merged);
        if (submitResult.error) {
          setError(submitResult.error);
          await showError("Submission failed", submitResult.error);
          return;
        }

        await showSuccess(
          "Application submitted",
          "Your application has been submitted successfully."
        );
        router.refresh();
        return;
      }

      const result = await saveApplicationSectionAction(
        currentSection,
        payload,
        "next"
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.nextSection) {
        setCurrentSection(result.nextSection);
      }
      router.refresh();
    });
  }

  function renderSection() {
    const merged = mergeFormData(formData);

    switch (currentSection) {
      case 1:
        return (
          <PersonalSection
            data={merged.personal ?? emptyPersonal()}
            onChange={(personal) => setFormData((d) => ({ ...d, personal }))}
          />
        );
      case 2:
        return (
          <EnrolmentSection
            data={merged.enrolment ?? emptyEnrolment()}
            onChange={(enrolment) => setFormData((d) => ({ ...d, enrolment }))}
          />
        );
      case 3:
        return (
          <EducationalBackgroundSection
            data={merged.educationalBackground ?? []}
            onChange={(educationalBackground) =>
              setFormData((d) => ({ ...d, educationalBackground }))
            }
          />
        );
      case 4:
        return (
          <FirstSittingSection
            data={merged.firstSitting!}
            onChange={(firstSitting) =>
              setFormData((d) => ({ ...d, firstSitting }))
            }
          />
        );
      case 5:
        return (
          <SecondSittingSection
            data={merged.secondSitting!}
            onChange={(secondSitting) =>
              setFormData((d) => ({ ...d, secondSitting }))
            }
          />
        );
      case 6:
        return (
          <UniversityDegreesSection
            data={merged.universityDegrees ?? []}
            onChange={(universityDegrees) =>
              setFormData((d) => ({ ...d, universityDegrees }))
            }
          />
        );
      case 7:
        return (
          <ParentGuardianSection
            data={merged.parentGuardian ?? emptyParentGuardian()}
            onChange={(parentGuardian) =>
              setFormData((d) => ({ ...d, parentGuardian }))
            }
          />
        );
      case 8:
        return (
          <SponsorshipSection
            data={merged.sponsorship ?? emptySponsorship()}
            onChange={(sponsorship) => setFormData((d) => ({ ...d, sponsorship }))}
          />
        );
      case 9:
        return (
          <DocumentsSection
            data={merged.documents ?? emptyDocuments()}
            onChange={(documents: ApplicationDocuments) =>
              setFormData((d) => ({ ...d, documents }))
            }
          />
        );
      case 10:
        return (
          <RefereesSection
            data={merged.referees ?? []}
            onChange={(referees) => setFormData((d) => ({ ...d, referees }))}
          />
        );
      case 11:
        return (
          <DeclarationSection
            data={merged.declaration ?? emptyDeclaration()}
            onChange={(declaration) =>
              setFormData((d) => ({ ...d, declaration }))
            }
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <StudentPageHero
        badge="Online application"
        icon={FiFileText}
        title="My application"
        description="Complete all 11 sections below. Use Save & Continue to progress—you can return to earlier sections before final submission."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ApplicationProgress
          currentSection={currentSection}
          maxReachable={currentSection}
          onJump={(id) => {
            if (id <= currentSection && id !== currentSection) {
              setError(undefined);
              setCurrentSection(id);
            }
          }}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 px-5 py-3 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
              Section {currentSection}
            </p>
          </div>
          <div className="p-5 sm:p-8">
            {renderSection()}
            <FormError message={error} />
            <div className="mt-8">
              <FormActions
                showPrevious={currentSection > 1}
                onPrevious={() => {
                  setError(undefined);
                  setCurrentSection((s) => Math.max(1, s - 1));
                }}
                pending={pending}
                isLastSection={isLastSection}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
