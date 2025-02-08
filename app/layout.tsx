import type { Metadata } from 'next'
import './globals.css'

// 元数据配置 | Metadata configuration
export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

// 根布局组件 | Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
