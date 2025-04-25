const Header = () => {
  return (
    <header className="w-full py-8 px-8 bg-gradient-to-r from-green-500 to-indigo-500 text-white text-center shadow-lg">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow mb-2">
        FitControl - Sistema de Gestão de Academia
      </h1>
      <h2 className="text-lg md:text-xl font-semibold mt-2 mb-1">
        Bem-vindo ao FitControl
      </h2>
      <p className="text-base md:text-lg font-normal max-w-2xl mx-auto">
        Gerencie suas rotinas de treino de forma simples e eficiente.<br />
        Selecione um aluno para visualizar ou editar as rotinas semanais.
      </p>
    </header>
  );
};

export default Header;