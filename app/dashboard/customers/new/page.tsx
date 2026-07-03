import CustomerForm from '@/components/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-2">إضافة عميل جديد</h1>
      <p className="text-[#8FA3B8] text-sm mb-6">أدخل بيانات العميل الجديد</p>
      <CustomerForm />
    </div>
  )
}
