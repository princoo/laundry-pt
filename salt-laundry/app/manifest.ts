import type { MetadataRoute } from 'next'

// Makes the dashboard installable on staff tablets and phones.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SALT of Akagera — Laundry',
    short_name: 'SALT Laundry',
    description: 'Hotel laundry management for SALT of Akagera staff',
    start_url: '/staff',
    display: 'standalone', // Hides browser chrome when installed
    background_color: '#f5f4f1', // Cream — shown during splash screen
    theme_color: '#0d2137', // Navy — matches the nav bar
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
