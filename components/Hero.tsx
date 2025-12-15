import React from 'react';
import { ArrowRight, Lock, ShieldCheck, Database } from 'lucide-react';
import { AppSection } from '../types';

interface HeroProps {
  setSection: (section: AppSection) => void;
}

const Hero: React.FC<HeroProps> = ({ setSection }) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 min-h-[calc(100vh-64px)] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center lg:text-left">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-900/50 border border-brand-500/30 text-brand-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 mr-2 animate-pulse"></span>
              TCC UniLaSalle 2025
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
              <span className="block">Democracia Digital</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">
                Auditável e Segura
              </span>
            </h1>
            <p className="mt-4 max-w-lg mx-auto lg:mx-0 text-xl text-slate-400 mb-8">
              Um modelo teórico-prático de votação digital utilizando <strong>Blockchain</strong> e <strong>Smart Contracts</strong> para garantir integridade, sigilo e auditabilidade pública.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setSection(AppSection.VOTING_DEMO)}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
              >
                Testar Protótipo
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button 
                onClick={() => setSection(AppSection.THESIS)}
                className="inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-lg text-slate-300 hover:bg-slate-800 md:py-4 md:text-lg transition-all"
              >
                Ler o Trabalho
              </button>
            </div>

            <div className="mt-10 text-sm text-slate-500">
              <p>Autores: <strong>Leandro Santos Teixeira</strong> & <strong>Paulo Ricardo Tebet Lyrio</strong></p>
              <p>Orientador: <strong>Prof. Alessandro Cerqueira</strong></p>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 relative">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">Ethereum Testnet</div>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Imutabilidade</h3>
                            <p className="text-sm text-slate-400">Votos registrados em blockchain não podem ser alterados.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Database size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Descentralização</h3>
                            <p className="text-sm text-slate-400">Sem ponto único de falha ou controle centralizado.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                            <Lock size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Criptografia</h3>
                            <p className="text-sm text-slate-400">Autenticação via MetaMask e assinaturas digitais.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;