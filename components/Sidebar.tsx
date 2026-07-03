'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, LogOut, UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard',           icon: <LayoutDashboard className="w-4 h-4" />, label: 'الرئيسية' },
  { href: '/dashboard/customers', icon: <Users           className="w-4 h-4" />, label: 'العملاء'  },
]

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const name     = user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم'

  async function logout() {
    await supabase.auth.signOut()
    toast.success('تم تسجيل الخروج')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 min-h-screen bg-[#141E2B] border-l border-[#2A3A50]
                      flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#2A3A50]">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">💎</span>
          <div>
            <p className="font-black text-gold-500 leading-tight text-sm">محل الماسة</p>
            <p className="text-[#4A6080] text-xs">إطارات · بطاريات</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold
                          transition-all duration-150
                          ${active
                            ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                            : 'text-[#8FA3B8] hover:bg-[#1F2D40] hover:text-white'}`}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-5 border-t border-[#2A3A50] pt-4 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <UserCircle className="w-8 h-8 text-[#4A6080] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{name}</p>
            <p className="text-[#4A6080] text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm
                     text-[#8FA3B8] hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
