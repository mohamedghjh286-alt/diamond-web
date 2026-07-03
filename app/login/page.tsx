'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'البريد أو كلمة المرور غير صحيحة'
        : error.message)
      setLoading(false)
      return
    }
    toast.success('مرحباً بك!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-96 h-96 bg-gold-500 opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💎</div>
          <h1 className="text-2xl font-black text-gold-500">محل الماسة</h1>
          <p className="text-[#8FA3B8] text-sm mt-1">إطارات · بطاريات · خدمات السيارات</p>
        </div>

        {/* Card */}
        <div className="card p-7">
          <h2 className="text-lg font-bold text-center mb-6">تسجيل الدخول</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="input-label">البريد الإلكتروني</label>
              <input
                type="email" required autoComplete="email"
                placeholder="example@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">كلمة المرور</label>
              <input
                type="password" required autoComplete="current-password"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>
          <p className="text-center text-sm text-[#8FA3B8] mt-5">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-gold-500 hover:text-gold-400 font-semibold">
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
