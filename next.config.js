/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出静态文件 | Output static files
  output: 'export',
  
  // 图片优化配置 | Image optimization configuration
  images: {
    unoptimized: true,
  },
  
  // 资源前缀 | Asset prefix
  assetPrefix: './',
  
  // 输出目录 | Output directory
  distDir: 'dist/renderer',
}

module.exports = nextConfig 