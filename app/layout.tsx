// app/layout.tsx
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'FitControl - Sistema de Gestão de Academia',
  description: 'Gerencie alunos, treinos e resultados de forma eficiente',
  keywords: ['academia', 'gestão de treinos', 'alunos', 'fitness', 'rotinas de treino'], // Adicione palavras-chave relevantes
  openGraph: {
    title: 'FitControl - Sistema de Gestão de Academia',
    description: 'Gerencie alunos, treinos e resultados de forma eficiente',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen font-sans flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}