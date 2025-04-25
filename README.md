# Controle de Treino

Este é um projeto [Next.js](https://nextjs.org) para controle de treinos, academias, alunos, objetivos e rotinas, utilizando Supabase como backend.

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

---

## Visão Geral

O Controle de Treino é uma aplicação web para gestão de treinos de alunos em academias. Permite cadastrar alunos, exercícios, objetivos, rotinas semanais e registrar resultados de treinos, tudo integrado ao Supabase.

## Funcionalidades

- Cadastro de alunos, exercícios, objetivos e rotinas semanais
- Associação de exercícios a rotinas
- Registro de resultados e acompanhamento de progresso
- Visualização de treinos realizados e últimas avaliações
- Interface moderna com React e TailwindCSS

## Pré-requisitos

- Node.js >= 18.x
- npm, yarn, pnpm ou bun
- Conta no [Supabase](https://supabase.com/) (ou use as chaves de exemplo)

## Configuração do Ambiente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/controle-treino.git
   cd controle-treino
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   # ou
   bun install
   ```

3. **Configure as variáveis de ambiente:**
   - Copie `.env.local.example` para `.env.local` (se existir) ou edite `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou yarn dev, pnpm dev, bun dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento com hot reload
- `npm run build` — Gera a build de produção
- `npm start` — Inicia o servidor em modo produção
- `npm run lint` — Executa o linter

## Estrutura de Pastas

```
app/
  cadastro-aluno/         # Cadastro de alunos
  cadastro-exercicio/     # Cadastro de exercícios
  cadastro-objetivo/      # Cadastro de objetivos
  cadastro-rotina/        # Cadastro de rotinas semanais
  resultados/             # Visualização de resultados e treinos
  components/             # Componentes reutilizáveis (UI)
  globals.css             # Estilos globais
  layout.tsx              # Layout principal
  page.tsx                # Página inicial
lib/
  supabase.ts             # Instância/configuração do Supabase
public/
  ...                     # Imagens e arquivos estáticos
.next/                    # Build do Next.js (ignorado no git)
.vercel/                  # Configuração do Vercel (deploy)
```

## Variáveis de Ambiente

- `NEXT_PUBLIC_SUPABASE_URL` — URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Chave pública do Supabase

Essas variáveis devem estar no arquivo `.env.local` na raiz do projeto.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) — Framework React para aplicações web
- [React](https://react.dev/) — Biblioteca de UI
- [Supabase](https://supabase.com/) — Backend as a Service (autenticação, banco de dados, storage)
- [TailwindCSS](https://tailwindcss.com/) — Utilitários de CSS
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática para JavaScript

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nome-da-feature`)
3. Commit suas alterações (`git commit -m 'feat: minha contribuição'`)
4. Push para o branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

---

Dúvidas? Abra uma issue ou entre em contato!
