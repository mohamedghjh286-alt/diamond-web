import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // verify ownership
  const { data: cust } = await supabase
    .from('customers').select('id').eq('id', params.id).eq('user_id', user.id).single()
  if (!cust) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext  = file.name.split('.').pop()
  const path = `${user.id}/${params.id}/${Date.now()}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('customer-images')
    .upload(path, file, { upsert: false })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  const { data, error } = await supabase
    .from('customer_images')
    .insert({ customer_id: params.id, path, label: 'صورة الهوية' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { imageId } = await req.json()

  const { data: img } = await supabase
    .from('customer_images').select('path').eq('id', imageId).single()
  if (img) await supabase.storage.from('customer-images').remove([img.path])

  await supabase.from('customer_images').delete().eq('id', imageId)
  return NextResponse.json({ success: true })
}
