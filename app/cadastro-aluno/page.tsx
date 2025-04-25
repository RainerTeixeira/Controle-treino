// app/cadastro-aluno/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { useFormState } from 'react-dom';
import SubmitButton from '../components/ui/SubmitButton';

// Tipos para dados
interface Academia {
    academia_id: string;
    nome: string;
}
interface Objetivo {
    objetivo_id: string;
    descricao: string;
}

// Função de cadastro local (exemplo, ajuste conforme sua action real)
async function cadastrarAluno(): Promise<unknown> {
    // ...implemente a lógica de cadastro aqui ou importe de outro arquivo...
    return {};
}

export default function CadastroAlunoPage() {
    const [state, formAction] = useFormState(
        cadastrarAluno,
        null as { error?: string; success?: boolean } | null
    );

    const [academias, setAcademias] = useState<Academia[]>([]);
    const [objetivos, setObjetivos] = useState<Objetivo[]>([]);

    useEffect(() => {
        async function fetchData() {
            const academiasRes = await fetch('/api/academias').then(res => res.json());
            setAcademias(academiasRes.data || []);
            const objetivosRes = await fetch('/api/objetivos').then(res => res.json());
            setObjetivos(objetivosRes.data || []);
        }
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Cadastrar Novo Aluno</h1>

                <Card>
                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                id="peso"
                                name="peso"
                                min={1}
                                step="any"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-1">
                                Altura (m)
                            </label>
                            <input
                                type="number"
                                id="altura"
                                name="altura"
                                min={0.5}
                                step="any"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-1">
                                Data de Nascimento
                            </label>
                            <input
                                type="date"
                                id="data_nascimento"
                                name="data_nascimento"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="academia_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Academia
                            </label>
                            <select
                                id="academia_id"
                                name="academia_id"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            >
                                <option value="">Selecione uma academia</option>
                                {academias.map((a) => (
                                    <option key={a.academia_id} value={a.academia_id}>
                                        {a.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="objetivo_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Objetivo
                            </label>
                            <select
                                id="objetivo_id"
                                name="objetivo_id"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                            >
                                <option value="">Selecione um objetivo</option>
                                {objetivos.map((o) => (
                                    <option key={o.objetivo_id} value={o.objetivo_id}>
                                        {o.descricao}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2">
                            <SubmitButton loading={false}>
                                Cadastrar Aluno
                            </SubmitButton>
                        </div>

                        {state && 'error' in state && typeof state.error === 'string' && state.error && (
                            <p className="text-red-500 text-sm">{state.error}</p>
                        )}

                        {state && 'success' in state && !!state.success && (
                            <p className="text-green-600 text-sm">Aluno cadastrado com sucesso!</p>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
}