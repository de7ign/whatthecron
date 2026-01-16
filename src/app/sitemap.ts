export const baseUrl = 'https://www.whatthecron.dev';

const buildDate = new Date().toISOString().split('T')[0];

export default function sitemap() {
  const routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: buildDate,
  }));

  return routes;
}
