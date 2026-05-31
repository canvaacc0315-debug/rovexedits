export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/editor-dashboard/', '/api/'],
    },
    sitemap: 'https://rovexedits.com/sitemap.xml',
  }
}
