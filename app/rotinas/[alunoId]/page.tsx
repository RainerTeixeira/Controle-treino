import { supabase } from '@/lib/supabase'

export default async function RotinaPage({
    params
}: {
    params: { alunoId: string }
}) {
    const { data: rotinas } = await supabase
        .from('rotinas_semanais')
        .select(`
      *,
      dias_semana(nome),
      rotina_exercicios(
        *,
        exercicios(*)
      )
    `)
        .eq('aluno_id', params.alunoId)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Rotina Semanal</h1>
            <div className="space-y-6">
                {rotinas?.map((rotina) => (
                    <div key={rotina.rotina_id} className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">
                            {(rotina.dias_semana as any).nome} - {rotina.tempo_previsto}min
                        </h2>
                        <div className="space-y-2">
                            {(rotina.rotina_exercicios as any[]).map((re) => (
                                <div key={re.rotina_exercicio_id} className="border p-3 rounded">
                                    <h3 className="font-medium">{(re.exercicios as any).nome}</h3>
                                    <p>Séries: {re.series} x {re.repeticoes} reps</p>
                                    <p>Descanso: {re.descanso}s</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}