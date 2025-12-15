import React from 'react';
import { BookOpen, Vote, Activity, Home, Menu, X, Link } from 'lucide-react';
import { AppSection } from '../types';

interface NavbarProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, setSection }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: AppSection.HOME, label: 'Início', icon: Home },
    { id: AppSection.THESIS, label: 'O Trabalho (TCC)', icon: BookOpen },
    { id: AppSection.VOTING_DEMO, label: 'Simular Votação', icon: Vote },
    { id: AppSection.AUDIT, label: 'Auditoria', icon: Activity },
    { id: AppSection.REFERENCES, label: 'Referências', icon: Link },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-brand-500 font-bold text-xl flex items-center gap-2 cursor-pointer" onClick={() => setSection(AppSection.HOME)}>
              <span className="text-2xl">🗳️</span>
              <span className="hidden md:block">UniLaSalle <span className="text-slate-400 font-normal">| Democracia Digital</span></span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentSection === item.id
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    currentSection === item.id
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;