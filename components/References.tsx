import React, { useState } from 'react';
import { ExternalLink, Book, Globe, FileText, GraduationCap, Star, Send, User, MessageSquare } from 'lucide-react';
import { Evaluation } from '../types';

interface ReferencesProps {
  evaluations: Evaluation[];
  onSubmitEvaluation: (evaluation: Omit<Evaluation, 'id'>) => void;
}

const References: React.FC<ReferencesProps> = ({ evaluations, onSubmitEvaluation }) => {
  // Form State
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(10);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newEval = {
      name,
      grade,
      comment,
      timestamp: new Date().toLocaleString()
    };

    onSubmitEvaluation(newEval);

    // Reset Form
    setName('');
    setGrade(10);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const references = [
    {
      type: "academic",
      title: "The Return of Software Vulnerabilities in the Brazilian Voting Machine",
      author: "ARANHA, D. F. et al. (2019)",
      description: "Computers & Security, v. 86, p. 335-349. Análise crítica sobre vulnerabilidades de software.",
      link: "https://scholar.google.com/scholar?q=The+Return+of+Software+Vulnerabilities+in+the+Brazilian+Voting+Machine"
    },
    {
      type: "academic",
      title: "Segurança em sistemas e auditorias em urnas eletrônicas",
      author: "BRUNAZO FILHO, A. (2014)",
      description: "Anais do 14º Simpósio Brasileiro de Segurança da Informação.",
      link: "https://scholar.google.com/scholar?q=Segurança+em+sistemas+e+auditorias+em+urnas+eletrônicas"
    },
    {
      type: "web",
      title: "Ethereum Development Tutorials",
      author: "ETHEREUM FOUNDATION (2024)",
      description: "Documentação oficial para desenvolvedores sobre a arquitetura e desenvolvimento na rede Ethereum.",
      link: "https://ethereum.org/developers"
    },
    {
      type: "web",
      title: "Solidity Language Documentation",
      author: "SOLIDITY TEAM (2024)",
      description: "Documentação da linguagem orientada a objetos para escrever contratos inteligentes.",
      link: "https://docs.soliditylang.org"
    },
    {
      type: "paper",
      title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
      author: "NAKAMOTO, S. (2008)",
      description: "O paper seminal que introduziu a tecnologia Blockchain ao mundo.",
      link: "https://bitcoin.org/bitcoin.pdf"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Referências & Avaliação</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Fundamentação teórica do projeto e espaço para feedback da banca e visitantes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: REFERENCES */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-brand-400 mb-6 flex items-center gap-2">
            <Book size={20} /> Bibliografia Principal
          </h3>
          
          {references.map((ref, index) => {
            let Icon = FileText;
            if (ref.type === 'web') Icon = Globe;
            if (ref.type === 'academic') Icon = GraduationCap;
            if (ref.type === 'paper') Icon = Book;

            return (
              <a 
                key={index} 
                href={ref.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-slate-800 border border-slate-700 hover:border-brand-500 rounded-xl p-5 transition-all duration-300 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors text-slate-400 shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors mb-1 leading-snug">
                        {ref.title}
                      </h3>
                      <p className="text-xs text-brand-200 font-mono mb-1.5 uppercase tracking-wide">{ref.author}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {ref.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-slate-500 group-hover:text-brand-400 flex-shrink-0 mt-1" />
                </div>
              </a>
            );
          })}
        </div>

        {/* RIGHT COLUMN: EVALUATION FORM */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
              <Star className="text-yellow-400" size={20} fill="currentColor" /> Avaliação do Trabalho
            </h3>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Seu Nome</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="Ex: Prof. Silva"
                    required
                  />
                  <User size={16} className="absolute left-3 top-3 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nota (0 a 10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <span className={`text-xl font-bold font-mono px-3 py-1 rounded ${
                    grade >= 7 ? 'bg-green-500/20 text-green-400' : 
                    grade >= 5 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {grade}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Comentário</label>
                <div className="relative">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none h-24 resize-none"
                    placeholder="O que achou do projeto?"
                    required
                  />
                  <MessageSquare size={16} className="absolute left-3 top-3 text-slate-500" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submitted ? 'Enviado!' : <><Send size={18} /> Enviar Avaliação</>}
              </button>
            </form>

            {/* FEEDBACK LIST - LIMITADO A 3 ITENS E SEM SCROLL */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Últimas Avaliações</h4>
              
              {evaluations.length === 0 ? (
                <p className="text-slate-500 text-sm italic text-center py-4">Seja o primeiro a avaliar!</p>
              ) : (
                evaluations.slice(0, 3).map((ev, idx) => (
                  <div key={ev.id || idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 text-sm animate-fadeIn">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-200">{ev.name}</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span className="font-mono font-bold">{ev.grade}</span>
                        <Star size={12} fill="currentColor" />
                      </div>
                    </div>
                    <p className="text-slate-400 italic mb-2">"{ev.comment}"</p>
                    <div className="text-[10px] text-slate-600 text-right">{ev.timestamp}</div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
      
      <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 text-center">
        <p className="text-slate-500 text-sm">
          Este aplicativo é um <strong>artefato de software</strong> resultante da pesquisa aplicada (DSR).
          <br />
          Desenvolvido por Leandro Santos Teixeira e Paulo Ricardo Tebet Lyrio - UniLaSalle 2025.
        </p>
      </div>
    </div>
  );
};

export default References;