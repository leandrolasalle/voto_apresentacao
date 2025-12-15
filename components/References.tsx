import React from 'react';
import { ExternalLink, Book, Globe, FileText, GraduationCap } from 'lucide-react';

const References: React.FC = () => {
  const references = [
    {
      type: "academic",
      title: "The Return of Software Vulnerabilities in the Brazilian Voting Machine",
      author: "ARANHA, D. F. et al. (2019)",
      description: "Computers & Security, v. 86, p. 335-349. Análise crítica sobre vulnerabilidades de software encontradas em testes públicos de segurança.",
      link: "https://scholar.google.com/scholar?q=The+Return+of+Software+Vulnerabilities+in+the+Brazilian+Voting+Machine"
    },
    {
      type: "academic",
      title: "Segurança em sistemas e auditorias em urnas eletrônicas",
      author: "BRUNAZO FILHO, A. (2014)",
      description: "Anais do 14º Simpósio Brasileiro de Segurança da Informação e de Sistemas Computacionais. Sociedade Brasileira de Computação.",
      link: "https://scholar.google.com/scholar?q=Segurança+em+sistemas+e+auditorias+em+urnas+eletrônicas"
    },
    {
      type: "web",
      title: "i-Voting: A unique solution that simply and conveniently helps engage people",
      author: "E-ESTONIA (2024)",
      description: "Documentação oficial do governo da Estônia sobre seu sistema de votação digital pioneiro.",
      link: "https://e-estonia.com/solutions/e-governance/i-voting/"
    },
    {
      type: "web",
      title: "Ethereum Development Tutorials",
      author: "ETHEREUM FOUNDATION (2024)",
      description: "Documentação oficial para desenvolvedores sobre a arquitetura e desenvolvimento na rede Ethereum.",
      link: "https://ethereum.org/developers"
    },
    {
      type: "academic",
      title: "Democracia e blockchain: inter-relações e aplicações para votação",
      author: "FORNASIER, M. O. (2022)",
      description: "Revista de Direito, Governança e Novas Tecnologias. Discute os impactos jurídicos e democráticos da tecnologia.",
      link: "https://scholar.google.com/scholar?q=Democracia+e+blockchain+inter-relações+e+aplicações+para+votação"
    },
    {
      type: "academic",
      title: "Principles and requirements for a secure e-voting system",
      author: "GRITZALIS, D. A. (2002)",
      description: "Computers & Security, v. 21. Estabelece os requisitos fundamentais de segurança para sistemas de votação eletrônica.",
      link: "https://scholar.google.com/scholar?q=Principles+and+requirements+for+a+secure+e-voting+system"
    },
    {
      type: "web",
      title: "Blockchain: o futuro das eleições seguras e transparentes",
      author: "GUARESCHI, D. (2024)",
      description: "Artigo na Exame discutindo tendências futuras para processos eleitorais com uso de DLT.",
      link: "https://exame.com/future-of-money/blockchain-o-futuro-das-eleicoes-seguras-e-transparentes-no-processo-de-votacao/"
    },
    {
      type: "academic",
      title: "Secure electronic voting in the presence of insecure Internet infrastructure",
      author: "HAJIAN BERENJESTANAKI, M. et al. (2024)",
      description: "Information Processing & Management. Aborda desafios de segurança em redes não confiáveis.",
      link: "https://scholar.google.com/scholar?q=Secure+electronic+voting+in+the+presence+of+insecure+Internet+infrastructure"
    },
    {
      type: "web",
      title: "Hardhat Documentation",
      author: "HARDHAT (2024)",
      description: "Ambiente de desenvolvimento para compilar, implantar, testar e depurar software Ethereum.",
      link: "https://hardhat.org/docs"
    },
    {
      type: "academic",
      title: "Análise dos mecanismos de segurança das urnas eletrônicas brasileiras",
      author: "MACHADO FILHO, A. (2021)",
      description: "Dissertação de Mestrado - UFSCar. Um estudo aprofundado sobre a arquitetura de segurança atual.",
      link: "https://scholar.google.com/scholar?q=Análise+dos+mecanismos+de+segurança+das+urnas+eletrônicas+brasileiras"
    },
    {
      type: "web",
      title: "MetaMask Developer Documentation",
      author: "METAMASK (2024)",
      description: "Documentação técnica da carteira de criptomoedas utilizada para autenticação no projeto.",
      link: "https://docs.metamask.io"
    },
    {
      type: "paper",
      title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
      author: "NAKAMOTO, S. (2008)",
      description: "O paper seminal que introduziu a tecnologia Blockchain ao mundo.",
      link: "https://bitcoin.org/bitcoin.pdf"
    },
    {
      type: "paper",
      title: "Under the Hood: The West Virginia Mobile Voting Pilot",
      author: "NASS (2019)",
      description: "Relatório sobre o projeto piloto de votação móvel em West Virginia (Voatz).",
      link: "https://www.nass.org/sites/default/files/2019-02/white-paper-voatz-nass-winter19.pdf"
    },
    {
      type: "academic",
      title: "Análise sobre a segurança da urna eletrônica brasileira e estudo sobre blockchain",
      author: "SEPÚLVIDA, D. F.; PAIVA, J. L. S. (2019)",
      description: "Revista de Tecnologia da Informação e Comunicação. Comparativo entre modelos atuais e propostos.",
      link: "https://scholar.google.com/scholar?q=Análise+sobre+a+segurança+da+urna+eletrônica+brasileira+blockchain"
    },
    {
      type: "academic",
      title: "Proposta de arquitetura distribuída para sistemas de votação eletrônica",
      author: "SOARES, J. L.; VASCONCELOS, R. O. (2023)",
      description: "Revista Brasileira de Sistemas de Informação. Proposta técnica de arquitetura descentralizada.",
      link: "https://scholar.google.com/scholar?q=Proposta+de+arquitetura+distribuída+para+sistemas+de+votação+eletrônica"
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
      title: "The Ballot is Busted Before the Blockchain: A Security Analysis of Voatz",
      author: "SPECTER, M. A. et al. (2020)",
      description: "MIT Internet Policy Research Initiative. Análise de segurança crítica sobre aplicativos de votação pioneiros.",
      link: "https://internetpolicy.mit.edu/wp-content/uploads/2020/02/SecurityAnalysisOfVoatz_Public.pdf"
    },
    {
      type: "academic",
      title: "Blockchain Technology for E-Voting Systems: An Overview",
      author: "VLADUCU, A. et al. (2023)",
      description: "IEEE Access. Uma visão geral abrangente do estado da arte da tecnologia aplicada ao voto.",
      link: "https://scholar.google.com/scholar?q=Blockchain+Technology+for+E-Voting+Systems+An+Overview"
    },
    {
      type: "web",
      title: "The world's first blockchain-powered elections have just happened in Sierra Leone",
      author: "WORLD ECONOMIC FORUM (2018)",
      description: "Relato sobre a primeira implementação prática de eleições suportadas por blockchain.",
      link: "https://www.weforum.org/stories/2018/03/the-world-s-first-blockchain-powered-elections-just-happened-in-sierra-leone/"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Referências Bibliográficas</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Abaixo estão listadas as fontes acadêmicas e técnicas fundamentais que embasaram o desenvolvimento deste Trabalho de Conclusão de Curso, abrangendo desde a teoria da computação distribuída até análises de segurança de sistemas eleitorais.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
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