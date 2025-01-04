/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages that should be treated as server-only
  serverExternalPackages: ["knex", "pg"],
  experimental: {
    // Enable Turbopack
    turbo: {
      loaders: {
        // Add loaders for specific file types if needed
        ".sql": ["raw-loader"],
      },
      resolveAlias: {},
    },
  },
};

export default nextConfig;
