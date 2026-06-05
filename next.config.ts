import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/student/acceptance-letter",
        destination: "/student/offer-admission",
        permanent: true,
      },
      {
        source: "/admin/acceptance-letters",
        destination: "/admin/offer-admission",
        permanent: true,
      },
      {
        source: "/api/student/acceptance-letter/pdf",
        destination: "/api/student/offer-admission/pdf",
        permanent: true,
      },
      {
        source: "/api/admin/acceptance-letters/:studentId/pdf",
        destination: "/api/admin/offer-admission/:studentId/pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
