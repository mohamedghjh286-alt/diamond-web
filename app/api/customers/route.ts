import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, page_num, town, phone, notes } = body

  if (!name?.trim()) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 })

  const { data, error } = await supabase
    .from('customers')
    .insert({ name: name.trim(), page_num, town, phone, notes, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
