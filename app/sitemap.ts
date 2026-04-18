import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lechelon.com'
  const now = new Date()

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/subscribe`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/category/la-mode`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/category/la-vitesse`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/category/lhorlogerie`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/category/lequitation`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/category/lart-de-vivre`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]
}
