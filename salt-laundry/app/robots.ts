import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Index the guest-facing pages only
        userAgent: '*',
        allow: ['/', '/confirmation'],
        disallow: [
          '/staff/', // All staff pages
          '/api/', // All API routes
        ],
      },
    ],
    sitemap: `${process.env.APP_URL}/sitemap.xml`,
  }
}
