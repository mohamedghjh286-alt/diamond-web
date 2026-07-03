'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Save, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  customer?: {
    id: string; name: string; page_num?: string
    town?: string; phone?: string; notes?: string
  }
}

export default function CustomerForm({ customer }: Props) {
  const router  = useRouter()
  const isEdit  = !!customer
  const [form, setForm] = useState({
    name:     customer?.name     || '',
    page_num: customer?.page_num || '',
    town:     customer?.town     || '',
    phone:    customer?.phone    || '',
    notes:    customer?.notes    || '',
  })
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('الاسم مطلوب'); return }
    setLoading(true)

    const url    = isEdit ? `/api/customers/${customer!.id}` : '/api/customers'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || 'حدث خطأ'); setLoading(false); return }

    toast.success(isEdit ? 'تم تحديث البيانات ✓' : 'تم إضافة العميل ✓')
    router.push(`/dashboard/customers/${data.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="input-label">الاسم الكامل *</label>
          <input
            type="text" required placeholder="اسم العميل"
            value={form.name} onChange={e => set('name', e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">رقم الصفحة في السجل</label>
          <input
            type="text" placeholder="مثال: 42"
            value={form.page_num} onChange={e => set('page_num', e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">البلدة / المنطقة</label>
          <input
            type="text" placeholder="مثال: طرابلس"
            value={form.town} onChange={e => set('town', e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">رقم الموبايل</label>
          <input
            type="tel" placeholder="مثال: 03123456" dir="ltr"
            value={form.phone} onChange={e => set('phone', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="input-label">ملاحظات</label>
          <textarea
            rows={3} placeholder="أي ملاحظات إضافية..."
            value={form.notes} onChange={e => set('notes', e.target.value)}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2">
          <Save className="w-4 h-4" />
          {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إضافة العميل'}
        </button>
        <Link href="/dashboard/customers"
          className="btn-ghost flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" /> إلغاء
        </Link>
      </div>
    </form>
  )
}
