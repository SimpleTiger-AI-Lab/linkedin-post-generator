/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig