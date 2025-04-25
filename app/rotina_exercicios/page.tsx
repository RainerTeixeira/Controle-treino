'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../components/ui/Card';
import SubmitButton from '../components/ui/SubmitButton';

export default function CadastroRotinaExercicioPage() {
  const [rotinas, setRotinas] = useState<{ rotina_id: number; aluno_id: number; dia_id: number }[]>([]);
  const [exercicios, setExercicios] = useState<{ exercicio_id: number; nome: string }[]>([]);
  const [form, setForm] = useState({
    rotina_id: '',
    exercicio_id: '',
    series: '',
    repeticoes: '',
    descanso: '',
    ordem: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: rotinasData } = await supabase
        .from('rotinas_semanais')
        .select('rotina_id, aluno_id, dia_id')
        .order('rotina_id');
      setRotinas(rotinasData || []);
      const { data: exerciciosData } = await supabase
        .from('exercicios')
        .select('exercicio_id, nome')
        .order('nome');
      setExercicios(exerciciosData || []);
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const { rotina_id, exercicio_id, series, repeticoes, descanso, ordem } = form;
    if (!rotina_id || !exercicio_id || !series || !repeticoes || !ordem) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos obrigatórios.' });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('rotina_exercicios').insert([
      {
        rotina_id: Number(rotina_id),
        exercicio_id: Number(exercicio_id),
        series: Number(series),
        repeticoes: Number(repeticoes),
        descanso: descanso ? Number(descanso) : 0,
        ordem: Number(ordem),
      },
    ]);
    setLoading(false);

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Exercício adicionado à rotina com sucesso!' });
      setForm({
        rotina_id: '',
        exercicio_id: '',
        series: '',
        repeticoes: '',
        descanso: '',
        ordem: '',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Adicionar Exercício à Rotina</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="rotina_id" className="block text-sm font-medium text-gray-700 mb-1">
                Rotina Semanal
              </label>
              <select
                id="rotina_id"
                name="rotina_id"
                required
                value={form.rotina_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              >
                <option value="">Selecione a rotina</option>
                {rotinas.map(rotina => (
                  <option key={rotina.rotina_id} value={rotina.rotina_id}>
                    Rotina #{rotina.rotina_id} (Aluno {rotina.aluno_id}, Dia {rotina.dia_id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="exercicio_id" className="block text-sm font-medium text-gray-700 mb-1">
                Exercício
              </label>
              <select
                id="exercicio_id"
                name="exercicio_id"
                required
                value={form.exercicio_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              >
                <option value="">Selecione o exercício</option>
                {exercicios.map(ex => (
                  <option key={ex.exercicio_id} value={ex.exercicio_id}>
                    {ex.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
                Séries
              </label>
              <input
                type="number"
                id="series"
                name="series"
                required
                min={1}
                value={form.series}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div>
              <label htmlFor="repeticoes" className="block text-sm font-medium text-gray-700 mb-1">
                Repetições
              </label>
              <input
                type="number"
                id="repeticoes"
                name="repeticoes"
                required
                min={1}
                value={form.repeticoes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div>
              <label htmlFor="descanso" className="block text-sm font-medium text-gray-700 mb-1">
                Descanso (segundos)
              </label>
              <input
                type="number"
                id="descanso"
                name="descanso"
                min={0}
                value={form.descanso}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div>
              <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-1">
                Ordem na Rotina
              </label>
              <input
                type="number"
                id="ordem"
                name="ordem"
                required
                min={1}
                value={form.ordem}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div className="pt-2">
              <SubmitButton loading={loading}>Adicionar Exercício</SubmitButton>
            </div>
            {mensagem?.tipo === 'erro' && (
              <p className="text-red-500 text-sm">{mensagem.texto}</p>
            )}
            {mensagem?.tipo === 'sucesso' && (
              <p className="text-green-600 text-sm">{mensagem.texto}</p>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
