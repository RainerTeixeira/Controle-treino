'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BasePage from './components/BasePage';
import Header from './components/Header';
import { UserGroupIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';

interface Aluno {
  aluno_id: number;
  nome: string;
}

export default function Home() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoId, setAlunoId] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      setErro('');
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('alunos')
          .select('aluno_id, nome')
          .order('nome', { ascending: true });
        if (error) throw error;
        setAlunos(data || []);
      } catch (e: any) {
        setErro('Erro ao carregar alunos.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlunos();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoId) {
      setErro('Selecione um aluno antes de prosseguir.');
      return;
    }
    window.location.href = `/rotinas?aluno=${alunoId}`;
  };

  return (
    <BasePage>
      <Header />
      <section className="w-full max-w-md card mx-auto mt-14">
        <div className="flex flex-col items-center mb-7">
          <span className="text-6xl mb-3">🏋️‍♂️</span>
          <h2 className="text-3xl font-extrabold text-green-700 mb-2 flex items-center gap-2">
            <UserGroupIcon className="w-9 h-9 text-green-500" />
            Selecione um Aluno
          </h2>
          <p className="text-gray-400 text-base">Escolha para visualizar o treino personalizado</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {loading ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <select
              value={alunoId}
              onChange={e => setAlunoId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 bg-white text-gray-800 font-semibold shadow-sm transition"
            >
              <option value="" disabled>
                👤 Selecione um aluno
              </option>
              {alunos.map(aluno => (
                <option key={aluno.aluno_id} value={aluno.aluno_id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            disabled={loading || !alunoId}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-400 via-indigo-400 to-blue-400 text-white font-bold rounded-xl hover:from-green-500 hover:to-indigo-500 transition disabled:opacity-50 text-lg shadow-lg"
          >
            Ver Treino
            <ArrowRightCircleIcon className="w-6 h-6" />
          </button>

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
        </form>
      </section>
    </BasePage>
  );
}
