import dotenv from 'dotenv';
dotenv.config();

/**
 * Senior Developer Startup Check:
 * Ensures all critical configurations are present before the server starts.
 * This prevents obscure runtime errors and "undefined" crashes.
 */

const requiredEnv = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'FRONTEND_URL',
];

export const validateEnv = () => {
  const missing = requiredEnv.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`\n❌ CRITICAL CONFIGURATION MISSING:`);
    console.error(`The following environment variables are required but NOT found in .env:`);
    missing.forEach(key => console.error(` - ${key}`));
    console.error(`\nPlease check your .env file and restart the server.\n`);
    process.exit(1); // Stop the server immediately
  }

  console.log("✅ Environment Variables Validated");
};
