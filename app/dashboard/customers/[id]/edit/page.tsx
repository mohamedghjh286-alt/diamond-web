import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CustomerForm from '@/components/CustomerForm'

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!customer) notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-2">تعديل بيانات العميل</h1>
      <p className="text-[#8FA3B8] text-sm mb-6">{customer.name}</p>
      <CustomerForm customer={customer} />
    </div>
  )
}
