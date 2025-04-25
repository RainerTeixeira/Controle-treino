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
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8">Rotina Semanal</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rotinas?.map((rotina) => (
          <div key={rotina.rotina_id} className="card">
            <h2 className="text-2xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-base font-semibold">{rotina.dias_semana.nome}</span>
              <span className="text-gray-400 font-normal text-lg">· {rotina.tempo_previsto}min</span>
            </h2>
            <ul className="space-y-3">
              {rotina.rotina_exercicios.map((re) => (
                <li key={re.rotina_exercicio_id} className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-indigo-800">{re.exercicios.nome}</h3>
                  <p className="text-sm text-gray-600">
                    Séries: <span className="font-bold">{re.series}</span> x <span className="font-bold">{re.repeticoes}</span> reps
                  </p>
                  <p className="text-sm text-gray-500">Descanso: <span className="font-semibold">{re.descanso}s</span></p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}