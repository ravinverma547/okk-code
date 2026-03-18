const { z } = require('zod');
const dotenv = require('dotenv');

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5000'),
    MONGODB_URI: z.string().url(),
    JWT_SECRET: z.string().min(10),
    JWT_EXPIRE: z.string().default('30d'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
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
