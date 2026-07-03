'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search } from 'lucide-react'

export default function CustomerSearch({ initialValue }: { initialValue: string }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const handleChange = useCallback((val: string) => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (val) params.set('q', val)
      router.push(`${pathname}?${params.toString()}`)
    })
  }, [pathname, router])

  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6080] pointer-events-none" />
      <input
        type="search"
        defaultValue={initialValue}
        onChange={e => handleChange(e.target.value)}
        placeholder="بحث بالاسم أو الموبايل أو البلدة..."
        className="pr-10"
      />
    </div>
  )
}
