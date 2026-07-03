import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import AdsterraBanner from '@/components/AdsterraBanner'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'محل الماسة — إدارة العملاء',
  description: 'نظام إدارة عملاء محل الماسة للإطارات والبطاريات',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo bg-navy-950 text-white min-h-screen flex flex-col`}>
        <div className="flex-1">
          {children}
        </div>
        {/* Adsterra Banner 320x50 — يظهر في أسفل كل الصفحات */}
        <AdsterraBanner />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1F2D40', color: '#EDF2F7', border: '1px solid #2A3A50' },
            success: { iconTheme: { primary: '#D4A017', secondary: '#0F1923' } },
          }}
        />
      </body>
    </html>
  )
}
