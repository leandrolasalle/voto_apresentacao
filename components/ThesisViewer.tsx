import React, { useState } from 'react';
import { FileText, Book, Code, Layers, CheckCircle, GraduationCap, Search, FileCode, Activity, Database, ArrowRight, User, Globe, Cpu, Lock } from 'lucide-react';

// --- STATIC DATA EXTRACTION ---
// Moved outside component to prevent recreation on every render
const SECTIONS = {
  intro: {
    id: 'intro',
    icon: Search,
    title: "1. Introdução",
    text: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          Os processos eleitorais constituem um dos pilares fundamentais da soberania popular. Contudo, sistemas de votação tradicionais e eletrônicos (como urnas DRE) têm sido alvo de críticas relacionadas à vulnerabilidade a ataques cibernéticos, opacidade e limitações em auditorias independentes (centralização).
        </p>
        <div className="bg-slate-800 p-4 border-l-4 border-red-500 rounded-r-md my-4">
          <h4 className="font-bold text-white mb-2">O Problema de Pesquisa</h4>
          <p className="italic">"Como desenvolver um sistema de votação digital tecnicamente robusto, que incorpore técnicas avançadas de segurança resistentes a adulterações, sem comprometer os princípios de sigilo e auditabilidade?"</p>
        </div>
        <p>
          Neste cenário, a tecnologia <strong>blockchain</strong> surge como uma alternativa promissora. Com características como descentralização, imutabilidade e transparência, a blockchain permite registrar cada voto como uma transação criptografada, eliminando a necessidade de uma autoridade central confiável para a contagem.
        </p>
      </div>
    )
  },
  foundation: {
    id: 'foundation',
    icon: Book,
    title: "2. Fundamentação Teórica",
    text: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          Esta seção estabelece as bases conceituais necessárias para a compreensão da solução proposta, analisando o estado da arte da tecnologia.
        </p>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-brand-400 font-bold mb-1">Blockchain & Ethereum</h4>
            <p className="text-sm">Explora-se o conceito de livro-razão distribuído (Distributed Ledger), mecanismos de consenso (PoW/PoS) e a arquitetura da rede Ethereum como um computador mundial descentralizado.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-brand-400 font-bold mb-1">Smart Contracts</h4>
            <p className="text-sm">Protocolos computacionais autoexecutáveis que formalizam regras de negócio. No contexto eleitoral, definem quem pode votar e garantem que cada endereço vote apenas uma vez.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-brand-400 font-bold mb-1">Trilema da Blockchain</h4>
            <p className="text-sm">Análise dos desafios de equilibrar Descentralização, Segurança e Escalabilidade, e como isso impacta sistemas de votação em larga escala.</p>
          </div>
        </div>
      </div>
    )
  },
  methodology: {
    id: 'methodology',
    icon: Layers,
    title: "3. Metodologia",
    text: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          O trabalho utiliza a metodologia <strong>Design Science Research (DSR)</strong>, que é focada na criação e avaliação de artefatos tecnológicos para resolver problemas práticos.
        </p>
        <div className="relative border-l-2 border-slate-700 ml-4 space-y-6 pl-6 py-2">
          <div>
            <span className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-brand-600 border-2 border-slate-900"></span>
            <h4 className="text-white font-bold">1. Conscientização</h4>
            <p className="text-sm text-slate-400">Estudo das vulnerabilidades dos sistemas atuais (Urnas eletrônicas vs. Voto impresso).</p>
          </div>
          <div>
            <span className="absolute -left-[9px] top-1/2 w-4 h-4 rounded-full bg-brand-600 border-2 border-slate-900"></span>
            <h4 className="text-white font-bold">2. Desenvolvimento (Sugestão)</h4>
            <p className="text-sm text-slate-400">Modelagem da arquitetura descentralizada utilizando Smart Contracts em Solidity.</p>
          </div>
          <div>
            <span className="absolute -left-[9px] bottom-3 w-4 h-4 rounded-full bg-brand-600 border-2 border-slate-900"></span>
            <h4 className="text-white font-bold">3. Avaliação</h4>
            <p className="text-sm text-slate-400">Testes de integridade, unicidade do voto e resistência a censura.</p>
          </div>
        </div>
      </div>
    )
  },
  architecture: {
    id: 'architecture',
    icon: Layers,
    title: "4. Arquitetura e Modelagem",
    text: (
      <div className="space-y-8 text-slate-300 leading-relaxed">
        <div>
          <p className="mb-4">
            A arquitetura proposta opera de forma descentralizada, utilizando a blockchain Ethereum como camada de persistência imutável.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="text-brand-400 font-bold mb-2">Frontend (Cliente)</h4>
              <p className="text-sm">Interface Web Responsiva + MetaMask. A chave privada nunca sai do dispositivo do usuário.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="text-brand-400 font-bold mb-2">Smart Contract (On-Chain)</h4>
              <p className="text-sm">Regras de negócio imutáveis escritas em Solidity. Verifica elegibilidade e impede voto duplo.</p>
            </div>
          </div>
        </div>

        {/* DIAGRAMA DE ATIVIDADE */}
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-l-4 border-brand-500 pl-3">
               <Activity className="text-brand-400" size={24} /> Diagrama de Atividade: Fluxo do Voto
            </h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 overflow-x-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[600px] text-sm relative">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center w-32 relative z-10">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-500 mb-3">
                            <User size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-white text-center">1. Eleitor</span>
                        <span className="text-xs text-slate-500 text-center">Login/Identificação</span>
                    </div>

                    <ArrowRight className="text-slate-600 hidden md:block" />
                    <div className="h-8 w-0.5 bg-slate-600 md:hidden"></div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center w-32 relative z-10">
                         <div className="w-12 h-12 bg-orange-900/40 rounded-full flex items-center justify-center border-2 border-orange-500 mb-3">
                            <Globe size={24} className="text-orange-500" />
                        </div>
                        <span className="font-bold text-orange-400 text-center">2. Interface</span>
                        <span className="text-xs text-slate-500 text-center">Conexão Wallet</span>
                    </div>

                    <ArrowRight className="text-slate-600 hidden md:block" />
                    <div className="h-8 w-0.5 bg-slate-600 md:hidden"></div>

                     {/* Step 3 */}
                     <div className="flex flex-col items-center w-32 relative z-10">
                         <div className="w-12 h-12 bg-blue-900/40 rounded-full flex items-center justify-center border-2 border-blue-500 mb-3">
                            <Lock size={24} className="text-blue-500" />
                        </div>
                        <span className="font-bold text-blue-400 text-center">3. Assinatura</span>
                        <span className="text-xs text-slate-500 text-center">Chave Privada</span>
                    </div>

                    <ArrowRight className="text-slate-600 hidden md:block" />
                    <div className="h-8 w-0.5 bg-slate-600 md:hidden"></div>

                     {/* Step 4 */}
                     <div className="flex flex-col items-center w-32 relative z-10">
                         <div className="w-12 h-12 bg-purple-900/40 rounded-full flex items-center justify-center border-2 border-purple-500 mb-3 animate-pulse">
                            <Cpu size={24} className="text-purple-500" />
                        </div>
                        <span className="font-bold text-purple-400 text-center">4. Blockchain</span>
                        <span className="text-xs text-slate-500 text-center">Mineração e Registro</span>
                    </div>
                </div>
                <div className="mt-6 p-3 bg-slate-800 rounded text-xs text-slate-400 text-center border border-slate-700">
                    O fluxo garante que a identidade off-chain (Passo 1) seja desvinculada da ação on-chain (Passo 4) através do uso de carteiras pseudo-anônimas.
                </div>
            </div>
        </div>

        {/* MODELO CONCEITUAL */}
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-3">
               <Database className="text-purple-400" size={24} /> Modelo Conceitual de Dados
            </h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 overflow-x-auto">
                {/* Flex container para alinhar os 3 blocos */}
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start min-w-[700px] gap-0">
                    
                    {/* 1. Entity: Eleitor/Wallet */}
                    <div className="bg-slate-800 border-2 border-orange-500/50 rounded-lg w-60 shadow-lg hover:border-orange-500 transition-colors z-10">
                        <div className="bg-orange-500/20 p-2 border-b border-orange-500/30 text-center font-bold text-orange-300">
                            Entidade: Eleitor
                        </div>
                        <div className="p-4 space-y-2 font-mono text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-pink-400 text-xs">address</span>
                                <span className="text-white text-xs">msg.sender</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-700">
                                <p className="text-slate-500 text-[10px] text-center leading-tight">Identidade Criptográfica (Chave Pública)</p>
                            </div>
                        </div>
                    </div>

                    {/* Seta de Conexão 1 (Tamanho Fixo) */}
                    <div className="hidden md:flex flex-col items-center justify-center h-32 w-24 -mx-1 z-0 relative">
                        <span className="text-[10px] text-slate-500 mb-1 absolute -top-2">vote()</span>
                        <div className="w-full h-0.5 bg-slate-600 relative">
                            <div className="absolute right-0 -top-1.5 text-slate-600">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Entity: Voters Mapping */}
                    <div className="bg-slate-800 border-2 border-green-500/50 rounded-lg w-60 shadow-lg hover:border-green-500 transition-colors z-10">
                        <div className="bg-green-500/20 p-2 border-b border-green-500/30 text-center font-bold text-green-300">
                            Mapping: Voters
                        </div>
                        <div className="p-4 space-y-2 font-mono text-sm text-center">
                            <p className="text-slate-400 text-[10px] mb-2 uppercase tracking-wide">Controle de Unicidade</p>
                            <div className="bg-slate-900 p-2 rounded border border-slate-700 flex justify-center items-center gap-2">
                                <span className="text-pink-400 text-xs">addr</span>
                                <span className="text-slate-500 text-xs">➔</span>
                                <span className="text-pink-400 text-xs">bool</span>
                            </div>
                        </div>
                    </div>

                     {/* Seta de Conexão 2 (Tamanho Fixo - Igual à anterior) */}
                     <div className="hidden md:flex flex-col items-center justify-center h-32 w-24 -mx-1 z-0 relative">
                        <span className="text-[10px] text-slate-500 mb-1 absolute -top-2">addVote</span>
                        <div className="w-full h-0.5 bg-slate-600 relative">
                            <div className="absolute right-0 -top-1.5 text-slate-600">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Entity: Candidate */}
                    <div className="bg-slate-800 border-2 border-blue-500/50 rounded-lg w-60 shadow-lg hover:border-blue-500 transition-colors z-10">
                        <div className="bg-blue-500/20 p-2 border-b border-blue-500/30 text-center font-bold text-blue-300">
                            Struct: Candidate
                        </div>
                        <div className="p-4 space-y-2 font-mono text-sm">
                            <div className="flex justify-between">
                                <span className="text-pink-400 text-xs">uint</span>
                                <span className="text-white text-xs">id</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pink-400 text-xs">string</span>
                                <span className="text-white text-xs">name</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-pink-400 text-xs">uint</span>
                                <span className="text-white text-xs">voteCount</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    )
  },
  smartContract: {
    id: 'smartContract',
    icon: FileCode,
    title: "5. Smart Contract (Código)",
    text: (
      <div className="space-y-6">
        <p className="text-slate-300 text-lg">
          Abaixo está o <strong>código-fonte em Solidity</strong> desenvolvido para este projeto. O contrato implementa a lógica de unicidade e registro imutável.
        </p>
        
        <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-slate-700/80">
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10"></div>
            </div>
            <div className="text-xs text-slate-400 font-sans font-medium flex items-center gap-2">
              <FileCode size={12} /> VotingSystem.sol
            </div>
            <div className="w-10"></div>
          </div>

          <div className="bg-[#1e1e1e] p-8 overflow-x-auto">
            <code className="font-mono text-[16px] leading-8 text-slate-300 block">
              <div className="whitespace-pre"><span className="text-pink-400">pragma</span> <span className="text-blue-400">solidity</span> <span className="text-green-400">^0.8.19</span>;</div>
              <div className="h-6"></div>
              <div className="whitespace-pre text-slate-500 italic">// Contrato de Votação - TCC UniLaSalle 2025</div>
              <div className="whitespace-pre"><span className="text-pink-400">contract</span> <span className="text-yellow-300 font-bold">VotingSystem</span> {"{"}</div>
              <div className="h-6"></div>
              <div className="whitespace-pre text-slate-500 pl-4">// --- ESTRUTURAS DE DADOS ---</div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">struct</span> <span className="text-yellow-300">Candidate</span> {"{"}</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">uint</span> id;</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">string</span> name;</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">uint</span> voteCount;</div>
              <div className="whitespace-pre pl-4">{"}"}</div>
              <div className="h-6"></div>
              <div className="whitespace-pre text-slate-500 pl-4">// Mapeamento para garantir voto único (Sybil Resistance)</div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">mapping</span>(<span className="text-pink-400">address</span> {`=>`} <span className="text-pink-400">bool</span>) <span className="text-pink-400">public</span> voters;</div>
              <div className="h-6"></div>
              <div className="whitespace-pre text-slate-500 pl-4">// Lista dinâmica de candidatos</div>
              <div className="whitespace-pre pl-4"><span className="text-yellow-300">Candidate</span>[] <span className="text-pink-400">public</span> candidates;</div>
              <div className="h-6"></div>
              <div className="whitespace-pre text-slate-500 pl-4">// Evento para Auditoria Externa (Off-chain)</div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">event</span> <span className="text-yellow-300">VoteCast</span>(</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">address</span> <span className="text-pink-400">indexed</span> voter,</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">uint</span> candidateId,</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">uint</span> timestamp</div>
              <div className="whitespace-pre pl-4">);</div>
              <div className="h-8"></div>
              <div className="whitespace-pre text-slate-500 pl-4">// --- INICIALIZAÇÃO ---</div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">constructor</span>() {"{"}</div>
              <div className="whitespace-pre pl-8">_addCandidate(<span className="text-green-400">"Maria Silva"</span>);</div>
              <div className="whitespace-pre pl-8">_addCandidate(<span className="text-green-400">"João Santos"</span>);</div>
              <div className="whitespace-pre pl-8">_addCandidate(<span className="text-green-400">"Ana Souza"</span>);</div>
              <div className="whitespace-pre pl-4">{"}"}</div>
              <div className="h-6"></div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">function</span> <span className="text-yellow-300">_addCandidate</span>(<span className="text-pink-400">string</span> <span className="text-pink-400">memory</span> _name) <span className="text-pink-400">private</span> {"{"}</div>
              <div className="whitespace-pre pl-8">candidates.push(<span className="text-yellow-300">Candidate</span>(candidates.length, _name, 0));</div>
              <div className="whitespace-pre pl-4">{"}"}</div>
              <div className="h-8"></div>
              <div className="whitespace-pre text-slate-500 pl-4">// --- FUNÇÃO PRINCIPAL DE VOTO ---</div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">function</span> <span className="text-yellow-300 font-bold">vote</span>(<span className="text-pink-400">uint</span> _candidateId) <span className="text-pink-400">public</span> {"{"}</div>
              <div className="whitespace-pre text-slate-500 pl-8">// 1. Validação</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">require</span>(!voters[msg.sender], <span className="text-green-400">"Erro: Endereco ja votou."</span>);</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">require</span>(_candidateId {"<"} candidates.length, <span className="text-green-400">"Candidato invalido."</span>);</div>
              <div className="h-4"></div>
              <div className="whitespace-pre text-slate-500 pl-8">// 2. Registro do Estado</div>
              <div className="whitespace-pre pl-8">voters[msg.sender] = <span className="text-pink-400">true</span>;</div>
              <div className="whitespace-pre pl-8">candidates[_candidateId].voteCount++;</div>
              <div className="h-4"></div>
              <div className="whitespace-pre text-slate-500 pl-8">// 3. Emissão de Evento</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">emit</span> <span className="text-yellow-300">VoteCast</span>(msg.sender, _candidateId, block.timestamp);</div>
              <div className="whitespace-pre pl-4">{"}"}</div>
              <div className="h-8"></div>
              <div className="whitespace-pre pl-4"><span className="text-pink-400">function</span> <span className="text-yellow-300">getResults</span>() <span className="text-pink-400">public view returns</span> (<span className="text-yellow-300">Candidate</span>[] <span className="text-pink-400">memory</span>) {"{"}</div>
              <div className="whitespace-pre pl-8"><span className="text-pink-400">return</span> candidates;</div>
              <div className="whitespace-pre pl-4">{"}"}</div>
              <div className="whitespace-pre">{"}"}</div>
            </code>
          </div>
        </div>
      </div>
    )
  },
  results: {
    id: 'results',
    icon: CheckCircle,
    title: "6. Resultados",
    text: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
          <p>
              Os testes funcionais e de segurança realizados no ambiente de Testnet (Sepolia/Hardhat) validaram as hipóteses iniciais.
          </p>
          <div className="space-y-3 mt-4">
              <div className="flex items-start gap-3 bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                  <span className="text-green-500 font-bold">Integridade</span>
                  <p className="text-sm">100% dos votos emitidos foram registrados corretamente no ledger. Nenhuma transação foi perdida após a confirmação do bloco.</p>
              </div>
              <div className="flex items-start gap-3 bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                  <span className="text-green-500 font-bold">Unicidade</span>
                  <p className="text-sm">O sistema bloqueou com sucesso todas as tentativas de voto duplo (Reentrancy attack e reutilização de endereço).</p>
              </div>
              <div className="flex items-start gap-3 bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                  <span className="text-green-500 font-bold">Transparência</span>
                  <p className="text-sm">A auditoria em tempo real foi possível através da leitura pública dos eventos emitidos pelo contrato inteligente.</p>
              </div>
          </div>
      </div>
    )
  },
  conclusion: {
    id: 'conclusion',
    icon: GraduationCap,
    title: "7. Conclusão",
    text: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
          <p>
              O presente Trabalho de Conclusão de Curso demonstrou que a aplicação da tecnologia Blockchain em sistemas de votação é tecnicamente viável e oferece avanços significativos em termos de segurança e auditoria pública em comparação aos sistemas centralizados tradicionais.
          </p>
          <h4 className="font-bold text-white mt-4">Considerações Finais</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-400 ml-2">
              <li>O sistema garante imutabilidade e resistência a censura.</li>
              <li>O uso de Smart Contracts elimina a necessidade de confiança cega em autoridades centrais para a contagem.</li>
              <li><strong>Trabalhos Futuros:</strong> Investigar soluções de <em>Layer 2</em> (como Optimism ou zk-Rollups) para reduzir custos de transação (Gas) e aumentar a escalabilidade para eleições nacionais, além de mecanismos de identidade digital (DID) mais robustos.</li>
          </ul>
      </div>
    )
  }
};

const ThesisViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const activeContent = SECTIONS[activeTab as keyof typeof SECTIONS];
  const ActiveIcon = activeContent.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Estrutura do Trabalho</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Navegue pelas seções completas do TCC para compreender a fundamentação, o desenvolvimento e os resultados alcançados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {Object.values(SECTIONS).map((section) => {
             const Icon = section.icon;
             return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full text-left px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                  activeTab === section.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50 translate-x-1'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent hover:border-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-md ${activeTab === section.id ? 'bg-white/20' : 'bg-slate-700'}`}>
                   <Icon size={16} />
                </div>
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 min-h-[500px] relative overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-center gap-4 mb-8 border-b border-slate-700/50 pb-6">
              <div className="p-3 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl text-white shadow-lg">
                <ActiveIcon size={32} />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {activeContent.title}
              </h3>
            </div>
            
            <div className="animate-fadeIn text-lg">
              {activeContent.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisViewer;