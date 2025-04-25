import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()

    const { data, error } = await supabase
        .from('alunos')
        .insert([body])
        .select()

    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json(data[0])
}

export async function GET() {
    const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('data_cadastro', { ascending: false })

    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json(data)
}