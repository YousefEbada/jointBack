import * as dotenv from 'dotenv';
import { z } from 'zod';

const environment = process.env.NODE_ENV || 'development';
const result = dotenv.config({
    path: `.env.${environment}`
});

// Optionally handle errors if the file is missing (e.g., in a secure server environment)
if (result.error) {
    console.warn(`[Config] WARNING: .env file not found for environment: ${environment}`);
    // Do not throw, as variables might be injected by the hosting environment
}

console.log(`[Config] Running in environment: ${environment}. Loaded config from .env.${environment}`);

const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),

    // These variables are now loaded from the specific .env file!
    PORT: z.coerce.number().default(4000),
    MONGO_URI: z.string().min(1),
    CORS_ORIGINS: z.string().default('http://localhost:3000'),
    JWT_REQUEST_TOKEN_SECRET: z.string().min(10),
    JWT_ACCESS_TOKEN_SECRET: z.string().min(10),
    JWT_REFRESH_TOKEN_SECRET: z.string().min(10),
    JWT_REQUEST_TOKEN_EXPIRY: z.string().default('30m'),
    JWT_ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    JWT_REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
    RATE_LIMIT_MAX: z.coerce.number().default(120),
    NIXPEND_API_URL: z.string().min(1),
    NIXPEND_TOKEN: z.string().min(1),
    AZURE_STORAGE_ACCOUNT_NAME: z.string().min(1).default('devstoreaccount1'),
    AZURE_STORAGE_ACCOUNT_KEY: z.string().min(1).default('Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='),
    AZURE_STORAGE_CONTAINER_NAME: z.string().min(1).default('joint-clinic-dev'),
    AZURE_BLOB_CONN: z.string().default('UseDevelopmentStorage=true'),
    AZURE_BLOB_CONTAINER: z.string().default('medical')
});

export const env = EnvSchema.parse(process.env);