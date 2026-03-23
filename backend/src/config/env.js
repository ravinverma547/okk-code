const { z } = require('zod');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
    PORT: z.string().default('5000'),
    MONGODB_URI: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRE: z.string().default('30d'),
    NODE_ENV: z.string().default('development'),
});

const envVars = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    NODE_ENV: process.env.NODE_ENV,
};

const parsedEnv = envSchema.safeParse(envVars);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

module.exports = parsedEnv.data;
