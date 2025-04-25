'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../components/ui/Card';
import SubmitButton from '../components/ui/SubmitButton';

const dificuldades = ['Iniciante', 'Intermediário', 'Avançado'];

export default function CadastroExercicioPage() {
  const [equipamentos, setEquipamentos] = useState<{ equipamento_id: number; nome: string }[]>([]);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    equipamento_id: '',
    grupo_muscular: '',
    dificuldade: 'Iniciante',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  useEffect(() => {
    async function fetchEquipamentos() {
      const { data } = await supabase.from('equipamentos').select('equipamento_id, nome');
      setEquipamentos(data || []);
    }
    fetchEquipamentos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const { nome, descricao, equipamento_id, grupo_muscular, dificuldade } = form;
    const { error } = await supabase.from('exercicios').insert([
      {
        nome,
        descricao,
        equipamento_id: equipamento_id ? Number(equipamento_id) : null,
        grupo_muscular,
        dificuldade,
      },
    ]);
    setLoading(false);

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Exercício cadastrado com sucesso!' });
      setForm({
        nome: '',
        descricao: '',
        equipamento_id: '',
        grupo_muscular: '',
        dificuldade: 'Iniciante',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cadastrar Exercício</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Exercício
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                value={form.nome}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                rows={2}
              />
            </div>
            <div>
              <label htmlFor="equipamento_id" className="block text-sm font-medium text-gray-700 mb-1">
                Equipamento (opcional)
              </label>
              <select
                id="equipamento_id"
                name="equipamento_id"
                value={form.equipamento_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              >
                <option value="">Nenhum</option>
                {equipamentos.map(eq => (
                  <option key={eq.equipamento_id} value={eq.equipamento_id}>
                    {eq.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="grupo_muscular" className="block text-sm font-medium text-gray-700 mb-1">
                Grupo Muscular
              </label>
              <input
                type="text"
                id="grupo_muscular"
                name="grupo_muscular"
                value={form.grupo_muscular}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div>
              <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700 mb-1">
                Dificuldade
              </label>
              <select
                id="dificuldade"
                name="dificuldade"
                required
                value={form.dificuldade}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              >
                {dificuldades.map(dif => (
                  <option key={dif} value={dif}>{dif}</option>
                ))}
              </select>
            </div>
            <div className="pt-2">
              <SubmitButton loading={loading}>Cadastrar Exercício</SubmitButton>
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
