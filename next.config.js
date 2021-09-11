/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  generateBuildId: () => 'build',
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, {isServer}) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }

    return config
  },
}
