/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com"
      }
    ]
  },
  // 브라우저 기본 /favicon.ico 요청을 app/icon 으로 연결
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon", permanent: false }]
  }
}

export default nextConfig
