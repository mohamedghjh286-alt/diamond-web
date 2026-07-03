# 💎 دليل رفع محل الماسة على Vercel

## الخطوات (15 دقيقة)

---

### 1️⃣ إنشاء مشروع Supabase (مجاني)

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساباً
2. اضغط **New Project** وأعطِه اسماً (مثل: `diamond-tires`)
3. احفظ كلمة مرور قاعدة البيانات
4. انتظر دقيقة حتى يُنشأ المشروع

---

### 2️⃣ إعداد قاعدة البيانات

1. من القائمة الجانبية اضغط **SQL Editor**
2. انسخ كامل محتوى ملف `supabase-schema.sql`
3. الصقه في المحرر واضغط **Run**

---

### 3️⃣ إنشاء Storage Bucket للصور

1. من القائمة اضغط **Storage**
2. اضغط **New bucket**
3. الاسم: `customer-images`
4. فعّل **Public bucket** ✅
5. اضغط **Save**

---

### 4️⃣ الحصول على مفاتيح Supabase

من **Project Settings > API**:
- انسخ **Project URL**
- انسخ **anon public key**

---

### 5️⃣ رفع المشروع على GitHub

```bash
git init
git add .
git commit -m "محل الماسة - النسخة الأولى"
git remote add origin https://github.com/USERNAME/diamond-tires.git
git push -u origin main
```

---

### 6️⃣ النشر على Vercel (مجاني)

1. اذهب إلى [vercel.com](https://vercel.com) وسجّل بحساب GitHub
2. اضغط **Add New > Project**
3. اختر repository المشروع
4. في **Environment Variables** أضف:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGci... |

5. اضغط **Deploy** ✅

---

### 7️⃣ تفعيل Email في Supabase

من **Authentication > Settings**:
- فعّل **Enable Email Confirmations**: OFF (للتسهيل)
  أو ON إذا أردت تأكيد البريد

---

## 🎉 انتهى!

الموقع سيكون على رابط مثل: `https://diamond-tires.vercel.app`

---

## للتطوير المحلي

```bash
# أنشئ ملف .env.local
cp .env.local.example .env.local
# عدّل القيم فيه

# ثم شغّل
npm install
npm run dev
```
