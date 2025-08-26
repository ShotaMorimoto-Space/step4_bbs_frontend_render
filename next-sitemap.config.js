/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://step4-bbs-frontend-render.onrender.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
  trailingSlash: false,
}
