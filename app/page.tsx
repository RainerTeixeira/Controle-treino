// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';
import Card from './components/ui/Card';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [alunos, setAlunos] = useState<{ aluno_id: number; nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchAlunos() {
      const { data, error } = await supabase
        .from('alunos')
        .select('aluno_id, nome');
      if (error) setError(error.message);
      else setAlunos(data || []);
      setLoading(false);
    }
    fetchAlunos();
  }, []);

  const handleVerResultados = () => {
    if (alunoSelecionado) {
      router.push(`/resultados?aluno=${alunoSelecionado}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-indigo-100 mb-6">
              <UserGroupIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Selecione um Aluno
            </h2>
            <p className="text-gray-600 text-lg">Escolha um aluno para visualizar o treino personalizado</p>
          </div>

          <div className="space-y-6">
            {loading && <p className="text-center text-gray-500">Carregando alunos...</p>}
            {error && <div className="text-red-600 text-center">Erro: {error}</div>}

            {!loading && !error && (
              <>
                <select
                  className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  value={alunoSelecionado}
                  onChange={e => setAlunoSelecionado(e.target.value)}
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.aluno_id} value={aluno.aluno_id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>

                <button
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                  disabled={!alunoSelecionado}
                  onClick={handleVerResultados}
                >
                  Ver Resultados
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}