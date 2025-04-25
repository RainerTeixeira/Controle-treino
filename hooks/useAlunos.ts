'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Aluno {
    aluno_id: number
    nome: string
    email: string
    academia_id: number
    objetivo_id: number
}

export function useAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAlunos = async () => {
            const { data, error } = await supabase
                .from('alunos')
                .select('*')
                .order('data_cadastro', { ascending: false })

            if (!error) setAlunos(data as Aluno[])
            setLoading(false)
        }

        fetchAlunos()

        const subscription = supabase
            .channel('alunos-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'alunos'
            }, fetchAlunos)
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    return { alunos, loading }
}