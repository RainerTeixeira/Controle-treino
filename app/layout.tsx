import Navbar from './components/Navbar';

export const metadata = {
  title: 'Sistema Academia',
  description: 'Gerencie treinos e alunos de forma eficiente.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-50 font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
