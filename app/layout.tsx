import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
      <body className="bg-gradient-to-br from-green-50 via-white to-indigo-50 min-h-screen font-sans flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
}
