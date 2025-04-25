'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../components/ui/Card';
import SubmitButton from '../components/ui/SubmitButton';

export default function CadastroObjetivoPage() {
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);
  const [objetivos, setObjetivos] = useState<{ objetivo_id: number; descricao: string }[]>([]);

  useEffect(() => {
    async function fetchObjetivos() {
      const { data } = await supabase.from('objetivos').select('*').order('descricao');
      setObjetivos(data || []);
    }
    fetchObjetivos();
  }, [mensagem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const { error } = await supabase.from('objetivos').insert([{ descricao }]);
    setLoading(false);

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Objetivo cadastrado com sucesso!' });
      setDescricao('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cadastrar Objetivo</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Objetivo
              </label>
              <input
                type="text"
                id="descricao"
                name="descricao"
                required
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div className="pt-2">
              <SubmitButton loading={loading}>Cadastrar Objetivo</SubmitButton>
            </div>
            {mensagem?.tipo === 'erro' && (
              <p className="text-red-500 text-sm">{mensagem.texto}</p>
            )}
            {mensagem?.tipo === 'sucesso' && (
              <p className="text-green-600 text-sm">{mensagem.texto}</p>
            )}
          </form>
        </Card>

        <Card className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Objetivos Cadastrados</h2>
          {objetivos.length === 0 && <p className="text-gray-500">Nenhum objetivo cadastrado.</p>}
          {objetivos.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {objetivos.map(obj => (
                <li key={obj.objetivo_id}>{obj.descricao}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
