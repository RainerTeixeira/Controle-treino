// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// DEBUG: vai aparecer no console do navegador
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey?.slice(0, 6) + '…')

export const supabase = createClient(supabaseUrl, supabaseKey)
