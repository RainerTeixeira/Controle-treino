export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">Controle de Treino</h1>
        <p className="text-gray-700 text-center mb-6">
          Gerencie alunos, rotinas, exercícios e resultados da sua academia de forma simples e eficiente.
        </p>
        <div className="flex flex-col gap-3">
          <a href="/cadastro-aluno" className="w-full text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Cadastrar Aluno
          </a>
          <a href="/cadastro-exercicio" className="w-full text-center py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Cadastrar Exercício
          </a>
          <a href="/cadastro-rotina" className="w-full text-center py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
            Cadastrar Rotina
          </a>
          <a href="/resultados" className="w-full text-center py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
            Resultados
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">
          Deploy pronto para Vercel • Next.js + Tailwind CSS
        </p>
        <p className="text-xs text-gray-400 mt-2 text-center">
          E configure o arquivo `tailwind.config.js` e importe o CSS em `app/globals.css` ou similar.
        </p>
      </div>
    </main>
  );
}