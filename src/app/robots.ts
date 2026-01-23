import { baseUrl } from './sitemap';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    host: baseUrl,
  };
}
