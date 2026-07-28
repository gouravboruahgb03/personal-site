/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Next.js to optimize (resize + WebP) images from these hosts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ioppqsrasmivmqarlsdc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
