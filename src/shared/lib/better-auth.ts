import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { env } from '../../shared/config/env';
import { PrismaService } from '../database/prisma.service';

const prisma = new PrismaService();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
        usePlural: true,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BACKEND_URL,
    trustedOrigins: [env.FRONTEND_URL],
    advanced: {
        cookies: {
            session_token: {
                name: 'x-quizzio-token',
                attributes: {
                    httpOnly: true,
                    secure: env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                },
            },
        },
    },
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
});