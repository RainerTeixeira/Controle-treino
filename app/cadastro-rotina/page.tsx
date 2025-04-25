'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../components/ui/Card';
import SubmitButton from '../components/ui/SubmitButton';

export default function CadastroRotinaPage() {
  const [alunos, setAlunos] = useState<{ aluno_id: number; nome: string }[]>([]);
  const [dias, setDias] = useState<{ dia_id: number; nome: string }[]>([]);
  const [exercicios, setExercicios] = useState<{ exercicio_id: number; nome: string }[]>([]);
  const [form, setForm] = useState({
    aluno_id: '',
    dia_id: '',
    tempo_previsto: '',
    hora_preferencia: '',
    exercicio_id: '',
    series: '',
    repeticoes: '',
    descanso: '',
    ordem: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);
  const [rotinaId, setRotinaId] = useState<number | null>(null);
  const [exerciciosDaRotina, setExerciciosDaRotina] = useState<{ rotina_exercicio_id: number; exercicios: { nome: string }; series: number; repeticoes: number; descanso: number; ordem: number }[]>([]);
  const [rotinasAluno, setRotinasAluno] = useState<{ rotina_id: number; dia_id: number; tempo_previsto: number; hora_preferencia: string; dias_semana?: { nome: string } }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: alunosData } = await supabase.from('alunos').select('aluno_id, nome');
      setAlunos(alunosData || []);
      const { data: diasData } = await supabase.from('dias_semana').select('dia_id, nome').order('dia_id');
      setDias(diasData || []);
      const { data: exerciciosData } = await supabase.from('exercicios').select('exercicio_id, nome').order('nome');
      setExercicios(exerciciosData || []);
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAlunoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aluno_id = e.target.value;
    setForm({ ...form, aluno_id });
    setRotinasAluno([]); // Limpa antes de buscar
    if (aluno_id) {
      const { data, error } = await supabase
        .from('rotinas_semanais')
        .select('rotina_id, dia_id, tempo_previsto, hora_preferencia, dias_semana(nome)')
        .eq('aluno_id', aluno_id)
        .order('dia_id');
      if (!error && data) {
        setRotinasAluno(
          data.map((item) => ({
            ...item,
            dias_semana:
              Array.isArray(item.dias_semana) && item.dias_semana.length > 0
                ? { nome: String(item.dias_semana[0].nome) }
                : undefined,
            rotina_id: Number(item.rotina_id),
            dia_id: Number(item.dia_id),
            tempo_previsto: Number(item.tempo_previsto),
            hora_preferencia: String(item.hora_preferencia ?? ''),
          }))
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const { aluno_id, dia_id, tempo_previsto, hora_preferencia } = form;

    if (!aluno_id || !dia_id || !tempo_previsto) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos obrigatórios da rotina.' });
      setLoading(false);
      return;
    }

    const { data: rotinaExistente, error: erroBusca } = await supabase
      .from('rotinas_semanais')
      .select('rotina_id')
      .eq('aluno_id', aluno_id)
      .eq('dia_id', dia_id)
      .maybeSingle();

    if (erroBusca) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao verificar rotina existente.' });
      setLoading(false);
      return;
    }

    if (rotinaExistente) {
      setMensagem({ tipo: 'erro', texto: 'Já existe uma rotina cadastrada para este aluno neste dia da semana.' });
      setLoading(false);
      return;
    }

    const { data: rotinaData, error: rotinaError } = await supabase.from('rotinas_semanais').insert([
      {
        aluno_id: Number(aluno_id),
        dia_id: Number(dia_id),
        tempo_previsto: Number(tempo_previsto),
        hora_preferencia: hora_preferencia || null,
      },
    ]).select('rotina_id').single();

    if (rotinaError) {
      setMensagem({ tipo: 'erro', texto: rotinaError.message });
      setLoading(false);
      return;
    }

    setRotinaId(rotinaData.rotina_id);
    setMensagem({ tipo: 'sucesso', texto: 'Rotina cadastrada com sucesso! Agora adicione exercícios à rotina.' });
    setForm({
      aluno_id: '',
      dia_id: '',
      tempo_previsto: '',
      hora_preferencia: '',
      exercicio_id: '',
      series: '',
      repeticoes: '',
      descanso: '',
      ordem: '',
    });
    setLoading(false);
    setExerciciosDaRotina([]);
  };

  const handleAddExercicio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    if (!rotinaId) {
      setMensagem({ tipo: 'erro', texto: 'Cadastre a rotina primeiro.' });
      setLoading(false);
      return;
    }

    const { exercicio_id, series, repeticoes, descanso, ordem } = form;

    if (!exercicio_id || !series || !repeticoes || !ordem) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos do exercício.' });
      setLoading(false);
      return;
    }

    const { error: exercicioError } = await supabase.from('rotina_exercicios').insert([
      {
        rotina_id: rotinaId,
        exercicio_id: Number(exercicio_id),
        series: Number(series),
        repeticoes: Number(repeticoes),
        descanso: descanso ? Number(descanso) : 0,
        ordem: Number(ordem),
      },
    ]);

    if (exercicioError) {
      setMensagem({ tipo: 'erro', texto: `Erro ao cadastrar exercício: ${exercicioError.message}` });
      setLoading(false);
      return;
    }

    const { data: listaEx, error: erroLista } = await supabase
      .from('rotina_exercicios')
      .select('*, exercicios(nome)')
      .eq('rotina_id', rotinaId)
      .order('ordem');
    if (!erroLista) setExerciciosDaRotina(listaEx || []);

    setMensagem({ tipo: 'sucesso', texto: 'Exercício adicionado à rotina!' });
    setForm({
      ...form,
      exercicio_id: '',
      series: '',
      repeticoes: '',
      descanso: '',
      ordem: '',
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Cadastrar Rotina Semanal</h1>
        <Card>
          {/* Tabela de rotinas do aluno selecionado */}
          {!rotinaId && form.aluno_id && rotinasAluno.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Rotinas já cadastradas para este aluno:</h2>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Dia</th>
                    <th className="border px-2 py-1">Tempo Previsto (min)</th>
                    <th className="border px-2 py-1">Hora Preferência</th>
                  </tr>
                </thead>
                <tbody>
                  {rotinasAluno.map((rotina) => (
                    <tr key={rotina.rotina_id}>
                      <td className="border px-2 py-1">{rotina.dias_semana?.nome || rotina.dia_id}</td>
                      <td className="border px-2 py-1">{rotina.tempo_previsto}</td>
                      <td className="border px-2 py-1">{rotina.hora_preferencia || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!rotinaId && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="aluno_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Aluno
                </label>
                <select
                  id="aluno_id"
                  name="aluno_id"
                  required
                  value={form.aluno_id}
                  onChange={handleAlunoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.aluno_id} value={aluno.aluno_id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dia_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Dia da Semana
                </label>
                <select
                  id="dia_id"
                  name="dia_id"
                  required
                  value={form.dia_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                >
                  <option value="">Selecione o dia</option>
                  {dias.map(dia => (
                    <option key={dia.dia_id} value={dia.dia_id}>
                      {dia.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tempo_previsto" className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo Previsto (minutos)
                </label>
                <input
                  type="number"
                  id="tempo_previsto"
                  name="tempo_previsto"
                  required
                  min={1}
                  value={form.tempo_previsto}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                />
              </div>
              <div>
                <label htmlFor="hora_preferencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Preferência (opcional)
                </label>
                <input
                  type="text"
                  id="hora_preferencia"
                  name="hora_preferencia"
                  value={form.hora_preferencia}
                  onChange={handleChange}
                  placeholder="Ex: 07:00, 18:30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                />
              </div>
              <div className="pt-4">
                <SubmitButton loading={loading} className="transition-transform duration-150 hover:scale-105">
                  Cadastrar Rotina
                </SubmitButton>
              </div>
              {mensagem?.tipo === 'erro' && (
                <p className="text-red-500 text-sm">{mensagem.texto}</p>
              )}
              {mensagem?.tipo === 'sucesso' && (
                <p className="text-green-600 text-sm">{mensagem.texto}</p>
              )}
            </form>
          )}

          {rotinaId && (
            <form onSubmit={handleAddExercicio} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700">Adicionar Exercício à Rotina</h2>
              <div>
                <label htmlFor="exercicio_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Exercício
                </label>
                <select
                  id="exercicio_id"
                  name="exercicio_id"
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
                    Séries
                  </label>
                  <input
                    type="number"
                    id="series"
                    name="series"
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
                    min={1}
                    value={form.repeticoes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  />
                </div>
                <div>
                  <label htmlFor="descanso" className="block text-sm font-medium text-gray-700 mb-1">
                    Descanso (s)
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
                    Ordem
                  </label>
                  <input
                    type="number"
                    id="ordem"
                    name="ordem"
                    min={1}
                    value={form.ordem}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  />
                </div>
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
              {exerciciosDaRotina.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Exercícios cadastrados nesta rotina:</h3>
                  <ul className="list-disc pl-5">
                    {exerciciosDaRotina.map((ex) => (
                      <li key={ex.rotina_exercicio_id}>
                        {ex.exercicios?.nome || 'Exercício'} - {ex.series}x{ex.repeticoes} ({ex.descanso}s) Ordem: {ex.ordem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
