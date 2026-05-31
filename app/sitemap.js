export default function sitemap() {
  const baseUrl = 'https://rovexedits.com';

  const routes = [
    '',
    '/about',
    '/contact',
    '/editors',
    '/gallery',
    '/privacy',
    '/reviews',
    '/services',
    '/store',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
