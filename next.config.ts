/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ja', 'en', 'zh', 'ko'],
    defaultLocale: 'ja',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
