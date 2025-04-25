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
    <div className="container mx-auto p-8 bg-gradient-to-br from-green-50 via-white to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-green-700 mb-10 drop-shadow-lg text-center tracking-tight">Rotina Semanal</h1>
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {rotinas?.map((rotina) => (
          <div
            key={rotina.rotina_id}
            className="bg-white border border-green-100 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-7 flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-2 flex items-center gap-3">
              <span className="bg-gradient-to-r from-green-300 to-green-500 text-white px-5 py-1 rounded-full text-base font-semibold shadow">
                {rotina.dias_semana.nome}
              </span>
              <span className="text-gray-400 font-normal text-lg">· {rotina.tempo_previsto}min</span>
            </h2>
            <ul className="space-y-5">
              {rotina.rotina_exercicios.map((re) => (
                <li
                  key={re.rotina_exercicio_id}
                  className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow hover:bg-indigo-100 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-indigo-800 text-lg mb-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                    {re.exercicios.nome}
                  </h3>
                  <p className="text-base text-gray-700">
                    <span className="font-semibold text-green-700">Séries:</span> <span className="font-bold">{re.series}</span> x <span className="font-bold">{re.repeticoes}</span> reps
                  </p>
                  <p className="text-base text-gray-500">
                    <span className="font-semibold text-indigo-700">Descanso:</span> <span className="font-semibold">{re.descanso}s</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}