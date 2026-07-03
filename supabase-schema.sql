-- ============================================================
-- محل الماسة — Supabase Schema
-- شغّل هذا الكود في Supabase > SQL Editor
-- ============================================================

-- 1. جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  page_num    TEXT,
  town        TEXT,
  phone       TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. جدول صور الهوية
CREATE TABLE IF NOT EXISTS customer_images (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id  UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  path         TEXT NOT NULL,
  label        TEXT DEFAULT 'صورة الهوية',
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_customers_user_id   ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_name      ON customers(name);
CREATE INDEX IF NOT EXISTS idx_images_customer_id  ON customer_images(customer_id);

-- ============================================================
-- Row Level Security — كل مستخدم يشوف بياناته فقط
-- ============================================================
ALTER TABLE customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_images ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "users_own_customers" ON customers
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Images policies (عبر الـ customer)
CREATE POLICY "users_own_images" ON customer_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = customer_images.customer_id
        AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = customer_images.customer_id
        AND c.user_id = auth.uid()
    )
  );

-- ============================================================
-- Storage bucket للصور
-- ============================================================
-- شغّل هذا بعد إنشاء الـ bucket يدوياً من لوحة Supabase
-- Storage > New bucket > اسمه: customer-images > Public: ON

-- Policy للـ Storage: كل مستخدم يرفع في مجلده فقط
CREATE POLICY "user_upload_own_folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'customer-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "user_read_own_folder" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'customer-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "user_delete_own_folder" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'customer-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
