import React from 'react';
import Footer from './Footer';

interface BasePageProps {
  children: React.ReactNode;
}

const BasePage = ({ children }: BasePageProps) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
    <main className="flex-1 flex flex-col items-center justify-center">
      {children}
    </main>
    <Footer />
  </div>
);

export default BasePage;
