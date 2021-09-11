/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  generateBuildId: () => 'build',
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, {isServer}) => {
    if (isServer) {
      // https://github.com/prisma/prisma/issues/6899
      config.externals.push('_http_common')
      config.externals.push('@prisma/client')
    }

    return config
  },
}
