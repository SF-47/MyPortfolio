// Featured projects on the home page. Links, images and descriptions come from `projects` in
// portfolioData.ts; this file adds the home-page presentation: the short descriptor, the fact
// rows (each taken from the verified project description and metadata) and how the screenshot
// is cropped to remove its empty margins.
export type FeaturedProject = {
  id: string
  eyebrow: string
  descriptor: string
  facts: Array<{ label: string; value: string }>
  caption: string
  // Natural pixel width of the screenshot, used for the expanded view.
  imageWidth: number
  // Crop to the part of the image that has content: aspect ratio, and the image's size and
  // offset inside the crop (percentages of the crop).
  crop: { aspect: string; width: number; left: number; top: number }
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: '01',
    eyebrow: '01 · University platform',
    descriptor: 'Lost-and-found platform for university campuses.',
    facts: [
      { label: 'Status', value: 'Repository public / not publicly deployed' },
      { label: 'Built', value: '64 endpoints · 17 screens · 11 admin pages' },
      { label: 'Stack', value: 'ASP.NET Core · React · Expo · PostgreSQL' },
    ],
    caption: 'Admin dashboard · match report · mobile app',
    imageWidth: 1600,
    crop: { aspect: '1508 / 784', width: 106.1, left: -2.9, top: -11.2 },
  },
  {
    id: '02',
    eyebrow: '02 · Freelance client',
    descriptor: 'Customer QR menu and admin management dashboard.',
    facts: [
      { label: 'Status', value: 'Live client website' },
      { label: 'Built', value: '2 languages with Arabic RTL · 23 components · 7 admin operations' },
      { label: 'Stack', value: 'React · Vite · Tailwind · Firebase' },
    ],
    caption: 'Bilingual menu · cart · admin panel',
    imageWidth: 1200,
    crop: { aspect: '1151 / 610', width: 104.3, left: -2.2, top: -23.8 },
  },
]
