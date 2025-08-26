/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-app-name.onrender.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
  trailingSlash: false,
}
