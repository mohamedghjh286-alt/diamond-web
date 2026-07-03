import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { UserPlus, Search } from 'lucide-react'
import CustomerSearch from '@/components/CustomerSearch'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const q = searchParams.q?.trim() || ''

  let query = supabase
    .from('customers')
    .select('id, name, page_num, town, phone, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,town.ilike.%${q}%`)
  }

  const { data: customers } = await query

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">قائمة العملاء</h1>
          <p className="text-[#8FA3B8] text-sm mt-0.5">
            {customers?.length ?? 0} عميل{q && ` — نتائج: "${q}"`}
          </p>
        </div>
        <Link href="/dashboard/customers/new" className="btn-gold flex items-center gap-2 w-fit text-sm">
          <UserPlus className="w-4 h-4" />
          عميل جديد
        </Link>
      </div>

      {/* Search */}
      <CustomerSearch initialValue={q} />

      {/* Table */}
      <div className="card overflow-hidden mt-4">
        {!customers || customers.length === 0 ? (
          <div className="py-20 text-center text-[#8FA3B8]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold">{q ? `لا توجد نتائج لـ "${q}"` : 'لا يوجد عملاء بعد'}</p>
            {!q && (
              <Link href="/dashboard/customers/new" className="btn-gold inline-block mt-5 text-sm">
                أضف أول عميل
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1F2D40] text-[#8FA3B8] text-xs uppercase tracking-wide">
                    <th className="px-5 py-3.5 text-right font-semibold">الاسم</th>
                    <th className="px-4 py-3.5 text-center font-semibold">رقم الصفحة</th>
                    <th className="px-4 py-3.5 text-right font-semibold">البلدة</th>
                    <th className="px-4 py-3.5 text-right font-semibold">الموبايل</th>
                    <th className="px-4 py-3.5 text-right font-semibold">تاريخ الإضافة</th>
                    <th className="px-4 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3A50]">
                  {customers.map((c, i) => (
                    <tr key={c.id}
                      className={`hover:bg-[#1F2D40] transition-colors ${i % 2 === 0 ? '' : 'bg-[#171F2E]'}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center
                                          justify-center text-gold-500 font-bold text-xs flex-shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-white">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                                         bg-gold-500/10 text-gold-500 font-bold text-sm">
                          {c.page_num || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#8FA3B8]">{c.town || '—'}</td>
                      <td className="px-4 py-3.5 text-[#8FA3B8] font-mono text-xs" dir="ltr">
                        {c.phone || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-[#8FA3B8] text-xs">
                        {new Date(c.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/dashboard/customers/${c.id}`}
                          className="text-gold-500 hover:text-gold-400 text-xs font-semibold transition-colors">
                          عرض ←
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#2A3A50]">
              {customers.map(c => (
                <Link key={c.id} href={`/dashboard/customers/${c.id}`}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-[#1F2D40] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center
                                  justify-center text-gold-500 font-bold flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{c.name}</p>
                    <p className="text-[#8FA3B8] text-xs">{c.town || ''} {c.phone ? `· ${c.phone}` : ''}</p>
                  </div>
                  <span className="text-gold-500 text-xs">←</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
