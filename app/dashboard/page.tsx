import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, UserPlus, BookOpen, Phone } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { data: recent } = await supabase
    .from('customers')
    .select('id, name, town, phone, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'المستخدم'

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">
          مرحباً، <span className="text-gold-500">{name}</span> 👋
        </h1>
        <p className="text-[#8FA3B8] text-sm mt-1">لوحة التحكم — محل الماسة للإطارات والبطاريات</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <Users className="text-gold-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-[#8FA3B8] text-xs">إجمالي العملاء</p>
            <p className="text-3xl font-black text-white">{totalCustomers ?? 0}</p>
          </div>
        </div>
        <Link href="/dashboard/customers/new" className="card p-5 flex items-center gap-4
              hover:border-gold-500 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center
                          group-hover:bg-gold-500/20 transition-colors">
            <UserPlus className="text-gold-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-[#8FA3B8] text-xs">إجراء سريع</p>
            <p className="text-base font-bold text-white">إضافة عميل جديد</p>
          </div>
        </Link>
        <Link href="/dashboard/customers" className="card p-5 flex items-center gap-4
              hover:border-gold-500 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center
                          group-hover:bg-gold-500/20 transition-colors">
            <BookOpen className="text-gold-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-[#8FA3B8] text-xs">إجراء سريع</p>
            <p className="text-base font-bold text-white">قائمة العملاء</p>
          </div>
        </Link>
      </div>

      {/* Recent customers */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#2A3A50]">
          <h2 className="font-bold text-white">آخر العملاء المضافين</h2>
          <Link href="/dashboard/customers"
            className="text-gold-500 text-sm hover:text-gold-400 transition-colors">
            عرض الكل ←
          </Link>
        </div>
        {!recent || recent.length === 0 ? (
          <div className="py-16 text-center text-[#8FA3B8]">
            <div className="text-4xl mb-3">📋</div>
            <p>لا يوجد عملاء بعد</p>
            <Link href="/dashboard/customers/new" className="btn-gold inline-block mt-4 text-sm">
              أضف أول عميل
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#2A3A50]">
            {recent.map(c => (
              <Link key={c.id} href={`/dashboard/customers/${c.id}`}
                className="flex items-center justify-between px-5 py-3.5
                           hover:bg-[#1F2D40] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center
                                  justify-center text-gold-500 font-bold text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm group-hover:text-gold-400 transition-colors">
                      {c.name}
                    </p>
                    <p className="text-[#8FA3B8] text-xs">{c.town || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#8FA3B8] text-xs">
                  {c.phone && <><Phone className="w-3 h-3" /> {c.phone}</>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
