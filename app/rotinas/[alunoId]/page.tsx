import { supabase } from '@/lib/supabase';

export default async function RotinaPage({ params }: { params: { alunoId: string } }) {
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
    .eq('aluno_id', params.alunoId);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Rotina Semanal</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rotinas?.map((rotina) => (
          <div key={rotina.rotina_id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {rotina.dias_semana.nome} - {rotina.tempo_previsto}min
            </h2>
            <ul className="space-y-2">
              {rotina.rotina_exercicios.map((re) => (
                <li key={re.rotina_exercicio_id} className="border p-3 rounded">
                  <h3 className="font-medium text-gray-700">{re.exercicios.nome}</h3>
                  <p className="text-sm text-gray-600">
                    Séries: {re.series} x {re.repeticoes} reps
                  </p>
                  <p className="text-sm text-gray-600">Descanso: {re.descanso}s</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}