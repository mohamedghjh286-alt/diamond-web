'use client'
import { Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  customer: { id: string; name: string; page_num?: string; town?: string; phone?: string; notes?: string; created_at: string }
  images:   { id: string; path: string; label: string }[]
}

export default function PrintButton({ customer, images }: Props) {
  const supabase = createClient()

  function getUrl(path: string) {
    return supabase.storage.from('customer-images').getPublicUrl(path).data.publicUrl
  }

  function print() {
    const imagesHtml = images.map(img => `
      <div class="id-card">
        <p class="id-label">${img.label || 'صورة الهوية'}</p>
        <img src="${getUrl(img.path)}" alt="${img.label}" crossorigin="anonymous" />
      </div>`).join('')

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>بطاقة عميل - الماسة</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Cairo', Arial, sans-serif;
    background:#fff; color:#1a1a2e;
    width:80mm; margin:0 auto; padding:6mm; font-size:11px;
  }
  .header { text-align:center; border-bottom:2px solid #D4A017; padding-bottom:5mm; margin-bottom:5mm; }
  .shop-name { font-size:20px; font-weight:900; color:#D4A017; }
  .shop-sub { font-size:11px; color:#555; margin-top:2px; }
  .diamond-icon { font-size:28px; margin-bottom:2px; }
  .card-title {
    background:#D4A017; color:#fff; text-align:center;
    padding:3px 0; font-weight:700; font-size:13px;
    border-radius:4px; margin-bottom:5mm;
  }
  .field-row {
    display:flex; justify-content:space-between; align-items:center;
    padding:4px 3px; border-bottom:1px solid #eee;
  }
  .field-row:nth-child(even) { background:#fafafa; }
  .field-label { color:#888; font-size:10px; }
  .field-value { font-weight:700; font-size:12px; color:#1a1a2e; }
  .page-badge {
    display:inline-flex; align-items:center; justify-content:center;
    background:#D4A017; color:#fff; border-radius:50%;
    width:26px; height:26px; font-weight:900; font-size:13px;
  }
  .images-section { margin-top:5mm; }
  .images-title { font-weight:700; font-size:11px; color:#D4A017; margin-bottom:3mm; border-bottom:1px dashed #D4A017; padding-bottom:2px; }
  .id-card { margin-bottom:4mm; text-align:center; }
  .id-label { font-size:10px; color:#666; margin-bottom:1mm; }
  .id-card img { width:100%; max-width:70mm; border:1px solid #ddd; border-radius:3px; }
  .footer { margin-top:5mm; text-align:center; font-size:9px; color:#aaa; border-top:1px solid #eee; padding-top:3mm; }
  @media print { body { width:80mm; } }
</style>
</head>
<body>
<div class="header">
  <div class="diamond-icon">💎</div>
  <div class="shop-name">محل الماسة</div>
  <div class="shop-sub">إطارات · بطاريات · خدمات السيارات</div>
</div>
<div class="card-title">بطاقة بيانات العميل</div>
<div class="field-row">
  <span class="field-label">الاسم الكامل</span>
  <span class="field-value">${customer.name}</span>
</div>
<div class="field-row">
  <span class="field-label">رقم الصفحة</span>
  <span class="field-value"><span class="page-badge">${customer.page_num || '—'}</span></span>
</div>
<div class="field-row">
  <span class="field-label">البلدة / المنطقة</span>
  <span class="field-value">${customer.town || '—'}</span>
</div>
<div class="field-row">
  <span class="field-label">رقم الموبايل</span>
  <span class="field-value" dir="ltr">${customer.phone || '—'}</span>
</div>
<div class="field-row">
  <span class="field-label">تاريخ التسجيل</span>
  <span class="field-value">${new Date(customer.created_at).toLocaleDateString('ar-EG')}</span>
</div>
${customer.notes ? `<div class="field-row" style="flex-direction:column;align-items:flex-start;gap:2px">
  <span class="field-label">ملاحظات</span>
  <span class="field-value">${customer.notes}</span>
</div>` : ''}
${imagesHtml ? `<div class="images-section"><div class="images-title">📋 صور الهوية</div>${imagesHtml}</div>` : ''}
<div class="footer">
  محل الماسة للإطارات والبطاريات<br>
  طُبع بتاريخ: ${new Date().toLocaleDateString('ar-EG')}
</div>
<script>window.onload = () => { window.print() }</script>
</body>
</html>`

    const win = window.open('', '_blank')
    if (win) { win.document.write(html); win.document.close() }
  }

  return (
    <button onClick={print}
      className="btn-ghost flex items-center gap-1.5 text-sm">
      <Printer className="w-3.5 h-3.5" /> طباعة
    </button>
  )
}
