import React from 'react';

const Footer = () => (
  <footer className="w-full text-center py-5 bg-gradient-to-r from-white via-green-50 to-indigo-50 border-t text-gray-400 text-base font-medium rounded-t-2xl shadow-inner mt-12">
    © {new Date().getFullYear()} Sistema Academia. Todos os direitos reservados.
  </footer>
);

export default Footer;
