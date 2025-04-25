// app/actions.ts
'use server'

import { supabase } from '@/lib/supabase'

export async function cadastrarAluno(formData: FormData) {
    const rawFormData = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        // outros campos
    }

    const { data, error } = await supabase
        .from('alunos')
        .insert([rawFormData])
        .select()

    if (error) {
        return { error: error.message }
    }

    return { success: true, data }
}