# Transit Admission System — Project Structure

```
transit-admission-system/
├── prisma/
│   └── schema.prisma          # Database models (10 tables)
├── public/
│   ├── images/                # Marketing assets
│   ├── logos/                 # College logo
│   └── uploads/               # Student document uploads
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── student/           # Student portal (/student/*)
│   │   ├── admin/             # Admin portal (/admin/*)
│   │   ├── auth/              # Login pages
│   │   └── api/               # API routes
│   ├── components/
│   ├── config/
│   │   └── navigation.ts      # Nav links for student & admin
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── actions/               # Server actions (to implement)
│   ├── hooks/
│   └── types/
└── package.json
```

## Student routes (`/student`)

| Route | Feature |
|-------|---------|
| `/` | Home |
| `/student/verify-pin` | Verify PIN |
| `/student/register` | Register |
| `/auth/login` | Login |
| `/student/application` | Application form |
| `/student/documents` | Upload documents |
| `/student/interview` | Interview schedule |
| `/student/status` | Admission status |
| `/student/acceptance-letter` | Download acceptance letter |

## Admin routes (`/admin`)

| Route | Feature |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/applicants` | Applicants |
| `/admin/programmes` | Programmes |
| `/admin/pins` | PIN management |
| `/admin/interviews` | Interviews |
| `/admin/acceptance-letters` | Acceptance letters |
| `/admin/notifications` | Notifications |
| `/admin/reports` | Reports |
| `/admin/settings` | Settings |

## API routes

| Route | Purpose |
|-------|---------|
| `/api/auth/[...nextauth]` | NextAuth session |
| `/api/pins/verify` | PIN verification |
| `/api/health` | Health check |
