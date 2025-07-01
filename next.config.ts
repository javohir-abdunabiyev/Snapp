import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'utfs.io',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
        NEXT_PUBLIC_UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);