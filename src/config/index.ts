/**
 * Centralized environment configuration for the VisiTrack frontend.
 * Ensures consistent environment variable consumption across the platform.
 */

const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
    timeout: 30000,
  },
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default config;
