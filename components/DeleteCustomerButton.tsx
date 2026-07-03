'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

export default function DeleteCustomerButton({
  customerId, customerName
}: { customerId: string; customerName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`هل تريد حذف العميل "${customerName}" نهائياً؟`)) return
    setLoading(true)
    const res = await fetch(`/api/customers/${customerId}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('تم حذف العميل')
      router.push('/dashboard/customers')
      router.refresh()
    } else {
      toast.error('فشل الحذف')
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="btn-ghost flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300
                 hover:border-red-400/30 border-red-400/20">
      <Trash2 className="w-3.5 h-3.5" />
      {loading ? '...' : 'حذف'}
    </button>
  )
}
