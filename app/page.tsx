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
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-indigo-100 mb-4">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Selecione um Aluno
            </h2>
            <p className="text-gray-500">Escolha um aluno para visualizar o treino personalizado</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            {loading && <div>Carregando alunos...</div>}
            {error && <div className="text-red-500">Erro ao carregar alunos: {error}</div>}
            {!loading && !error && (
              <>
                <select
                  className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                  className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-indigo-500 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  disabled={!alunoSelecionado}
                  onClick={handleVerResultados}
                >
                  Ver Resultados do Aluno
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}