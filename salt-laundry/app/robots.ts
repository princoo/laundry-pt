import type { MetadataRoute } from 'next'
import { getBrand } from '@/lib/brand'

// Read at request time: the origin comes from the deployment's environment.
export const dynamic = 'force-dynamic'

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
    sitemap: `${getBrand().appUrl}/sitemap.xml`,
  }
}
