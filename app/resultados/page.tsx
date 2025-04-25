'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ResultadosPage() {
  const searchParams = useSearchParams();
  const alunoId = searchParams.get('aluno');

  const [aluno, setAluno] = useState<Record<string, unknown> | null>(null);
  const [academia, setAcademia] = useState<Record<string, unknown> | null>(null);
  const [objetivo, setObjetivo] = useState<Record<string, unknown> | null>(null);
  const [resultados, setResultados] = useState<Record<string, unknown>[]>([]);
  const [rotinas, setRotinas] = useState<Array<{
    rotina_id: string;
    dia_id: number;
    tempo_previsto: number | null;
    hora_preferencia: string | null;
    dias_semana: { nome: string } | null;
    rotina_exercicios: Array<{
      rotina_exercicio_id: string;
      series: number;
      repeticoes: number;
      descanso: number;
      ordem: number;
      exercicios: {
        nome: string;
        descricao: string;
        grupo_muscular: string;
        dificuldade: string;
        equipamento_id: string | null;
        equipamentos: { nome: string; tipo: string } | null;
      } | null;
    }>;
  }>>([]);
  const [treinos, setTreinos] = useState<Array<{
    treino_id: string;
    rotina_id: string;
    data_hora_inicio: string | null;
    data_hora_fim: string | null;
    satisfacao: number | null;
    observacoes: string | null;
    rotinas_semanais: {
      dia_id: number;
      dias_semana: {
        nome: string;
      } | null;
    } | null;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!alunoId) return;

    async function fetchAll() {
      setLoading(true);

      // Buscar dados do aluno
      const { data: alunoData } = await supabase
        .from('alunos')
        .select('*, academia_id, objetivo_id')
        .eq('aluno_id', alunoId)
        .single();

      setAluno(alunoData);

      // Buscar academia
      if (alunoData?.academia_id) {
        const { data: acad } = await supabase
          .from('academias')
          .select('*')
          .eq('academia_id', alunoData.academia_id)
          .single();
        setAcademia(acad);
      } else {
        setAcademia(null);
      }

      // Buscar objetivo
      if (alunoData?.objetivo_id) {
        const { data: obj } = await supabase
          .from('objetivos')
          .select('*')
          .eq('objetivo_id', alunoData.objetivo_id)
          .single();
        setObjetivo(obj);
      } else {
        setObjetivo(null);
      }

      // Buscar últimos resultados
      const { data: res } = await supabase
        .from('resultados')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('data_avaliacao', { ascending: false })
        .limit(3);
      setResultados(res || []);

      // Buscar rotinas semanais e exercícios
      const { data: rotinasData } = await supabase
        .from('rotinas_semanais')
        .select(`
          rotina_id,
          dia_id,
          tempo_previsto,
          hora_preferencia,
          dias_semana (nome),
          rotina_exercicios (
            rotina_exercicio_id,
            series,
            repeticoes,
            descanso,
            ordem,
            exercicios (
              nome,
              descricao,
              grupo_muscular,
              dificuldade,
              equipamento_id,
              equipamentos (nome, tipo)
            )
          )
        `)
        .eq('aluno_id', alunoId)
        .order('dia_id', { ascending: true });

      setRotinas(
        (rotinasData || []).map((rotina: {
          rotina_id: string;
          dia_id: number;
          tempo_previsto: number | null;
          hora_preferencia: string | null;
          dias_semana: { nome: string } | null;
          rotina_exercicios: Array<{
            rotina_exercicio_id: string;
            series: number;
            repeticoes: number;
            descanso: number;
            ordem: number;
            exercicios: {
              nome: string;
              descricao: string;
              grupo_muscular: string;
              dificuldade: string;
              equipamento_id: string | null;
              equipamentos: { nome: string; tipo: string } | null;
            } | null;
          }>;
        }) => ({
          ...rotina,
          rotina_id: String(rotina.rotina_id),
          dia_id: Number(rotina.dia_id),
          tempo_previsto: rotina.tempo_previsto !== null ? Number(rotina.tempo_previsto) : null,
          hora_preferencia: rotina.hora_preferencia ?? null,
          dias_semana:
            Array.isArray(rotina.dias_semana) && rotina.dias_semana.length > 0
              ? { nome: String(rotina.dias_semana[0].nome) }
              : null,
          rotina_exercicios: Array.isArray(rotina.rotina_exercicios)
            ? rotina.rotina_exercicios.map((ex: {
                rotina_exercicio_id: string;
                series: number;
                repeticoes: number;
                descanso: number;
                ordem: number;
                exercicios: {
                  nome: string;
                  descricao: string;
                  grupo_muscular: string;
                  dificuldade: string;
                  equipamento_id: string | null;
                  equipamentos: { nome: string; tipo: string } | null;
                } | null;
              }) => ({
                ...ex,
                rotina_exercicio_id: String(ex.rotina_exercicio_id),
                series: Number(ex.series),
                repeticoes: Number(ex.repeticoes),
                descanso: Number(ex.descanso),
                ordem: Number(ex.ordem),
                exercicios:
                  Array.isArray(ex.exercicios) && ex.exercicios.length > 0
                    ? {
                        ...ex.exercicios[0],
                        nome: String(ex.exercicios[0].nome),
                        descricao: String(ex.exercicios[0].descricao),
                        grupo_muscular: String(ex.exercicios[0].grupo_muscular),
                        dificuldade: String(ex.exercicios[0].dificuldade),
                        equipamento_id:
                          ex.exercicios[0].equipamento_id !== null
                            ? String(ex.exercicios[0].equipamento_id)
                            : null,
                        equipamentos:
                          Array.isArray(ex.exercicios[0].equipamentos) && ex.exercicios[0].equipamentos.length > 0
                            ? {
                                nome: String(ex.exercicios[0].equipamentos[0].nome),
                                tipo: String(ex.exercicios[0].equipamentos[0].tipo),
                              }
                            : null,
                      }
                    : null,
              }))
            : [],
        }))
      );

      // Buscar treinos realizados
      const { data: treinosData } = await supabase
        .from('treinos')
        .select(`
          treino_id,
          rotina_id,
          data_hora_inicio,
          data_hora_fim,
          satisfacao,
          observacoes,
          rotinas_semanais (
            dia_id,
            dias_semana (nome)
          )
        `)
        .eq('aluno_id', alunoId)
        .order('data_hora_inicio', { ascending: false })
        .limit(5);

      setTreinos(treinosData || []);
      setLoading(false);
    }

    fetchAll();
  }, [alunoId]);

  if (!alunoId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <h1 className="text-2xl font-bold mb-4">Resultados do Aluno</h1>
          <p>Nenhum aluno selecionado.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Dados do Aluno</h1>
        <div className="mb-4">
          <strong>Nome:</strong> {aluno?.nome}<br />
          <strong>Email:</strong> {aluno?.email || '-'}<br />
          <strong>Peso:</strong> {aluno?.peso ? `${aluno.peso} kg` : '-'}<br />
          <strong>Altura:</strong> {aluno?.altura ? `${aluno.altura} m` : '-'}<br />
          <strong>Data de Nascimento:</strong> {aluno?.data_nascimento ? new Date(aluno.data_nascimento).toLocaleDateString() : '-'}<br />
          <strong>Data de Cadastro:</strong> {aluno?.data_cadastro ? new Date(aluno.data_cadastro).toLocaleDateString() : '-'}<br />
          <strong>Academia:</strong> {academia?.nome || '-'}<br />
          <strong>Localização:</strong> {academia?.localizacao || '-'}<br />
          <strong>Objetivo:</strong> {objetivo?.descricao || '-'}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Últimos Resultados Físicos</h2>
        {resultados.length === 0 && <p>Nenhum resultado encontrado.</p>}
        {resultados.length > 0 && (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Peso</th>
                <th className="p-2 border">Altura</th>
                <th className="p-2 border">% Gordura</th>
                <th className="p-2 border">% Músculo</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map(r => (
                <tr key={r.resultado_id}>
                  <td className="p-2 border">{new Date(r.data_avaliacao).toLocaleDateString()}</td>
                  <td className="p-2 border">{r.peso} kg</td>
                  <td className="p-2 border">{r.altura} m</td>
                  <td className="p-2 border">{r.percentual_gordura}%</td>
                  <td className="p-2 border">{r.percentual_musculo}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Rotina Semanal</h2>
        {rotinas.length === 0 && <p>Nenhuma rotina cadastrada.</p>}
        {rotinas.map(rotina => (
          <div key={rotina.rotina_id} className="mb-6">
            <div className="font-semibold mb-1">
              {rotina.dias_semana?.nome || `Dia ${rotina.dia_id}`} - {rotina.tempo_previsto} min {rotina.hora_preferencia && `| Preferência: ${rotina.hora_preferencia}`}
            </div>
            {rotina.rotina_exercicios.length === 0 && <p className="text-gray-500">Nenhum exercício cadastrado.</p>}
            {rotina.rotina_exercicios.length > 0 && (
              <table className="w-full text-sm border mb-2">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 border">Ordem</th>
                    <th className="p-2 border">Exercício</th>
                    <th className="p-2 border">Grupo Muscular</th>
                    <th className="p-2 border">Dificuldade</th>
                    <th className="p-2 border">Equipamento</th>
                    <th className="p-2 border">Descrição</th>
                    <th className="p-2 border">Séries</th>
                    <th className="p-2 border">Repetições</th>
                    <th className="p-2 border">Descanso (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {rotina.rotina_exercicios
                    .sort((a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem)
                    .map((ex: {
                      rotina_exercicio_id: string;
                      series: number;
                      repeticoes: number;
                      descanso: number;
                      ordem: number;
                      exercicios: {
                        nome: string;
                        descricao: string;
                        grupo_muscular: string;
                        dificuldade: string;
                        equipamento_id: string | null;
                        equipamentos: { nome: string; tipo: string } | null;
                      } | null;
                    }) => (
                      <tr key={ex.rotina_exercicio_id}>
                        <td className="p-2 border">{ex.ordem}</td>
                        <td className="p-2 border">{ex.exercicios?.nome}</td>
                        <td className="p-2 border">{ex.exercicios?.grupo_muscular || '-'}</td>
                        <td className="p-2 border">{ex.exercicios?.dificuldade || '-'}</td>
                        <td className="p-2 border">{ex.exercicios?.equipamentos?.nome || '-'}</td>
                        <td className="p-2 border">{ex.exercicios?.descricao || '-'}</td>
                        <td className="p-2 border">{ex.series}</td>
                        <td className="p-2 border">{ex.repeticoes}</td>
                        <td className="p-2 border">{ex.descanso}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </Card>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Últimos Treinos Realizados</h2>
        {treinos.length === 0 && <p>Nenhum treino registrado.</p>}
        {treinos.length > 0 && (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Data Início</th>
                <th className="p-2 border">Data Fim</th>
                <th className="p-2 border">Dia</th>
                <th className="p-2 border">Satisfação</th>
                <th className="p-2 border">Observações</th>
              </tr>
            </thead>
            <tbody>
              {treinos.map(treino => (
                <tr key={treino.treino_id}>
                  <td className="p-2 border">{treino.data_hora_inicio ? new Date(treino.data_hora_inicio).toLocaleString() : '-'}</td>
                  <td className="p-2 border">{treino.data_hora_fim ? new Date(treino.data_hora_fim).toLocaleString() : '-'}</td>
                  <td className="p-2 border">{treino.rotinas_semanais?.dias_semana?.nome || '-'}</td>
                  <td className="p-2 border">{treino.satisfacao || '-'}</td>
                  <td className="p-2 border">{treino.observacoes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
