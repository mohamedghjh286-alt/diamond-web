'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    if (password !== confirm) { toast.error('كلمتا المرور غير متطابقتين'); return }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) {
      toast.error(error.message === 'User already registered'
        ? 'البريد الإلكتروني مسجل مسبقاً'
        : error.message)
      setLoading(false)
      return
    }
    toast.success('تم إنشاء الحساب! يمكنك الدخول الآن')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-96 h-96 bg-gold-500 opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💎</div>
          <h1 className="text-2xl font-black text-gold-500">محل الماسة</h1>
          <p className="text-[#8FA3B8] text-sm mt-1">إنشاء حساب جديد</p>
        </div>

        <div className="card p-7">
          <h2 className="text-lg font-bold text-center mb-6">حساب جديد</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="input-label">الاسم الكامل</label>
              <input
                type="text" required placeholder="اسمك الكامل"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">البريد الإلكتروني</label>
              <input
                type="email" required placeholder="example@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">كلمة المرور</label>
              <input
                type="password" required placeholder="6 أحرف على الأقل"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">تأكيد كلمة المرور</label>
              <input
                type="password" required placeholder="أعد كتابة كلمة المرور"
                value={confirm} onChange={e => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>
          <p className="text-center text-sm text-[#8FA3B8] mt-5">
            لديك حساب؟{' '}
            <Link href="/login" className="text-gold-500 hover:text-gold-400 font-semibold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
