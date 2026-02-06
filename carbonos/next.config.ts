import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 环境变量配置
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  },
  // API 代理配置 - 解决跨域和部署问题
  async rewrites() {
    const apiUrl = process.env.BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
      {
        source: "/health",
        destination: `${apiUrl}/health`,
      },
      {
        source: "/metrics",
        destination: `${apiUrl}/metrics`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          }
        ],
      },
    ];
  },
};

export default nextConfig;

