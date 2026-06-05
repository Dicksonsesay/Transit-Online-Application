export const adminPageTitles: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/applicants": "Applicants",
  "/admin/pins": "PIN Management",
  "/admin/interviews": "Interviews",
  "/admin/acceptance-letters": "Offers of Admission",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
  "/admin/change-password": "Change Password",
};

export function getAdminPageTitle(pathname: string): string {
  return adminPageTitles[pathname] ?? "Admin Portal";
}
