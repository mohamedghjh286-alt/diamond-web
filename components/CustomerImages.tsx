'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Upload, Trash2, ImagePlus } from 'lucide-react'

interface ImgRow { id: string; path: string; label: string }

export default function CustomerImages({
  customerId,
  initialImages,
}: {
  customerId: string
  initialImages: ImgRow[]
}) {
  const [images, setImages]   = useState<ImgRow[]>(initialImages)
  const [uploading, setUpload] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function getUrl(path: string) {
    return supabase.storage.from('customer-images').getPublicUrl(path).data.publicUrl
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setUpload(true)
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} أكبر من 5MB`); continue }
      const fd = new FormData()
      fd.append('file', file)
      const res  = await fetch(`/api/customers/${customerId}/images`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'فشل الرفع'); continue }
      setImages(prev => [...prev, data])
      toast.success('تم رفع الصورة ✓')
    }
    setUpload(false)
  }

  async function deleteImage(img: ImgRow) {
    if (!confirm(`حذف الصورة؟`)) return
    const res = await fetch(`/api/customers/${customerId}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId: img.id }),
    })
    if (res.ok) {
      setImages(prev => prev.filter(i => i.id !== img.id))
      toast.success('تم حذف الصورة')
    }
  }

  return (
    <div>
      {/* Upload button */}
      <input
        ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <button onClick={() => inputRef.current?.click()} disabled={uploading}
        className="btn-ghost w-full flex items-center justify-center gap-2 mb-4 py-3 border-dashed">
        {uploading
          ? <><Upload className="w-4 h-4 animate-bounce" /> جاري الرفع...</>
          : <><ImagePlus className="w-4 h-4" /> رفع صورة هوية</>}
      </button>

      {/* Images grid */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-[#4A6080]">
          <div className="text-4xl mb-2">🪪</div>
          <p className="text-sm">لا توجد صور مرفقة</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden
                                          border border-[#2A3A50] aspect-[3/2]">
              <Image
                src={getUrl(img.path)} alt={img.label}
                fill className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                              transition-opacity flex items-center justify-center">
                <button onClick={() => deleteImage(img)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white
                              text-xs px-2 py-1 text-center">{img.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
