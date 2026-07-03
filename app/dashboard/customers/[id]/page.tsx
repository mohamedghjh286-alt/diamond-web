import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Pencil, Printer, Phone, MapPin, BookOpen, Calendar } from 'lucide-react'
import DeleteCustomerButton from '@/components/DeleteCustomerButton'
import PrintButton from '@/components/PrintButton'
import CustomerImages from '@/components/CustomerImages'

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!customer) notFound()

  const { data: images } = await supabase
    .from('customer_images')
    .select('id, path, label')
    .eq('customer_id', customer.id)
    .order('created_at')

  const fields = [
    { icon: <BookOpen className="w-4 h-4" />, label: 'رقم الصفحة', value: customer.page_num },
    { icon: <MapPin  className="w-4 h-4" />, label: 'البلدة / المنطقة', value: customer.town },
    { icon: <Phone   className="w-4 h-4" />, label: 'رقم الموبايل', value: customer.phone, mono: true },
    { icon: <Calendar className="w-4 h-4"/>, label: 'تاريخ التسجيل',
      value: new Date(customer.created_at).toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric'
      }) },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA3B8] mb-6">
        <Link href="/dashboard/customers" className="hover:text-gold-500 transition-colors flex items-center gap-1">
          <ArrowRight className="w-4 h-4" /> العملاء
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">{customer.name}</span>
      </div>

      {/* Header card */}
      <div className="card p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center
                            justify-center text-gold-500 font-black text-2xl flex-shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{customer.name}</h1>
              <p className="text-[#8FA3B8] text-sm">{customer.town || 'بدون بلدة'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <PrintButton customer={customer} images={images || []} />
            <Link href={`/dashboard/customers/${customer.id}/edit`}
              className="btn-ghost flex items-center gap-1.5 text-sm">
              <Pencil className="w-3.5 h-3.5" /> تعديل
            </Link>
            <DeleteCustomerButton customerId={customer.id} customerName={customer.name} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Info */}
        <div className="card p-6">
          <h2 className="font-bold text-gold-500 mb-4 text-sm uppercase tracking-wide">بيانات العميل</h2>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="text-[#8FA3B8] mt-0.5 flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-[#8FA3B8] text-xs">{f.label}</p>
                  <p className={`text-white font-semibold mt-0.5 ${f.mono ? 'font-mono text-sm' : ''}`}
                     dir={f.mono ? 'ltr' : 'rtl'}>
                    {f.value || '—'}
                  </p>
                </div>
              </div>
            ))}
            {customer.notes && (
              <div className="pt-3 border-t border-[#2A3A50]">
                <p className="text-[#8FA3B8] text-xs mb-1">ملاحظات</p>
                <p className="text-white text-sm leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="font-bold text-gold-500 mb-4 text-sm uppercase tracking-wide">صور الهوية</h2>
          <CustomerImages
            customerId={customer.id}
            initialImages={images || []}
          />
        </div>
      </div>
    </div>
  )
}
