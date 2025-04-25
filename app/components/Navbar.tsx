import Link from 'next/link';

const Navbar = () => {
  const links = [
    { href: '/', label: 'Início' },
    { href: '/cadastro-aluno', label: 'Cadastrar Aluno' },
    { href: '/cadastro-exercicio', label: 'Cadastrar Exercício' },
    { href: '/cadastro-rotina', label: 'Cadastrar Rotina' },
    { href: '/resultados', label: 'Resultados' },
    { href: '/rotinas', label: 'Ver Rotinas' },
  ];

  return (
    <nav className="backdrop-blur bg-white/80 shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <ul className="container mx-auto flex justify-center space-x-8 py-4">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-green-100 hover:to-indigo-100 hover:text-green-700 transition-colors duration-150"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;