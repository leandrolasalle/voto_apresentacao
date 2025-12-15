import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, Loader, AlertTriangle, User, RotateCcw, LogOut, Box, Cpu, ShieldCheck, Database, Lock, Search, XCircle, FileMinus, Ban } from 'lucide-react';
import { Candidate, WalletState, Transaction } from '../types';

interface VotingSimulatorProps {
  candidates: Candidate[];
  wallet: WalletState;
  connectWallet: () => void;
  castVote: (candidateId: number, voterId: string) => void;
  transactions: Transaction[];
  resetSimulation: () => void;
  resetVoterSession: () => void;
  usedVoterIds: string[];
}

const VotingSimulator: React.FC<VotingSimulatorProps> = ({ 
  candidates, 
  wallet, 
  connectWallet, 
  castVote,
  transactions,
  resetSimulation,
  resetVoterSession,
  usedVoterIds = [] // Default empty array to prevent crashes
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [miningStep, setMiningStep] = useState<number>(0);
  
  // Login State
  const [voterId, setVoterId] = useState('');
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Effect to simulate mining visual steps when wallet is mining
  useEffect(() => {
    let interval: any;
    if (wallet.isMining) {
      setMiningStep(0);
      interval = setInterval(() => {
        setMiningStep(prev => (prev + 1) % 4);
      }, 800);
    } else {
      setMiningStep(0);
    }
    return () => clearInterval(interval);
  }, [wallet.isMining]);

  const handleVoteClick = () => {
    if (selectedCandidate !== null) {
      castVote(selectedCandidate, voterId);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!voterId.trim()) return;

    setIsVerifying(true);
    
    // Simulate database lookup latency
    setTimeout(() => {
      setIsVerifying(false);
      
      // CHECK: Has this voter already voted?
      if (usedVoterIds.includes(voterId)) {
        setLoginError(`O Título de Eleitor ${voterId} já exerceu o voto nesta eleição.`);
        return;
      }

      // FIX: Cache Cleaning Logic
      // If we are logging in a NEW voter, but the system still holds a 'hasVoted' wallet 
      // (e.g. from a page refresh or previous session), we must disconnect that old wallet.
      // This forces the "Connect Wallet" screen to appear again for the new user.
      if (wallet.isConnected && wallet.hasVoted) {
        resetVoterSession();
      }

      setIsIdVerified(true);
    }, 1500);
  };

  const handleLogout = () => {
    setVoterId('');
    setIsIdVerified(false);
    setSelectedCandidate(null);
    setLoginError(null);
    resetVoterSession();
  };

  const myTransaction = transactions.find(t => t.from === wallet.address);

  // SCREEN 1: Voter Identification (Login)
  if (!isIdVerified) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-900/50 rounded-full flex items-center justify-center border border-brand-500/30">
              <User size={32} className="text-brand-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Identificação do Eleitor</h2>
          <p className="text-slate-400 text-center text-sm mb-8">
            Digite seu Título de Eleitor para verificar sua aptidão para votar nesta zona eleitoral digital.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="voterId" className="block text-sm font-medium text-slate-300 mb-1">
                Título de Eleitor
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="voterId"
                  value={voterId}
                  onChange={(e) => {
                    setVoterId(e.target.value.replace(/\D/g, ''));
                    setLoginError(null);
                  }}
                  placeholder="0000 0000 0000"
                  maxLength={12}
                  className={`block w-full bg-slate-900 border rounded-lg pl-10 pr-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    loginError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-600 focus:ring-brand-500 focus:border-transparent'
                  }`}
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Database size={18} className="text-slate-500" />
                </div>
              </div>
              
              {loginError ? (
                <div className="mt-2 text-sm text-red-400 flex items-start gap-2 animate-fadeIn">
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2 text-right">Apenas números</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!voterId || isVerifying}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all ${
                !voterId || isVerifying 
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  Verificando na Base de Dados...
                </>
              ) : (
                <>
                  <Search size={18} className="mr-2" />
                  Verificar Elegibilidade
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-start gap-3 text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">
              <Lock size={14} className="mt-0.5 shrink-0" />
              <p>Simulação: Em um sistema real, esta etapa validaria seus dados biométricos ou documentais junto à base do TSE (Off-chain) antes de liberar o token de votação.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: Connect Wallet (MetaMask)
  if (!wallet.isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
          {/* Status Bar for context */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
              <CheckCircle size={12} /> Eleitor Identificado: {voterId}
            </span>
          </div>

          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-12 h-12 relative z-10" />
            <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Autenticação Criptográfica</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Agora, conecte sua carteira digital para criar uma identidade anônima na Blockchain. Isso garante que seu voto seja registrado sem vincular sua identidade pessoal à sua escolha.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={connectWallet}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-slate-900 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105"
            >
              <Wallet className="mr-2" size={20} />
              Conectar Carteira MetaMask
            </button>
            <button
              onClick={() => setIsIdVerified(false)}
              className="inline-flex items-center px-6 py-3 border border-slate-600 text-base font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 4: Already Voted / Receipt
  if (wallet.hasVoted && !wallet.isMining) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="bg-slate-800 border border-brand-500/50 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-6">
             <CheckCircle size={32} />
           </div>
           <h2 className="text-3xl font-bold text-white mb-2">Voto Confirmado!</h2>
           <p className="text-slate-400 mb-8">Seu voto foi registrado imutavelmente na blockchain.</p>

           {myTransaction && (
             <div className="bg-slate-900 rounded-lg p-6 text-left font-mono text-sm border border-slate-700 shadow-inner">
               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
                 <span className="text-slate-500">Status</span>
                 <span className="text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Success</span>
               </div>
               <div className="mb-2">
                 <span className="block text-slate-500 text-xs">Transaction Hash:</span>
                 <span className="text-brand-400 break-all select-all">{myTransaction.hash}</span>
               </div>
               <div className="mb-2">
                 <span className="block text-slate-500 text-xs">Block:</span>
                 <span className="text-purple-400">{myTransaction.blockNumber}</span>
               </div>
               <div className="mb-2">
                 <span className="block text-slate-500 text-xs">Gas Used:</span>
                 <span className="text-slate-300">{myTransaction.gasUsed} Gwei</span>
               </div>
               <div>
                 <span className="block text-slate-500 text-xs">From (Wallet):</span>
                 <span className="text-slate-300 break-all">{myTransaction.from}</span>
               </div>
             </div>
           )}
           <p className="mt-4 text-xs text-slate-500">Este recibo garante que seu voto foi contabilizado sem revelar sua escolha (Pseudo-anonimato).</p>
        </div>
        
        <div className="mt-8 text-center flex flex-col items-center gap-4">
            <p className="text-slate-400 text-sm">Para reiniciar o sistema e permitir um novo eleitor:</p>
            <button 
                onClick={handleLogout} 
                className="inline-flex items-center text-white bg-brand-600 hover:bg-brand-700 px-6 py-3 rounded-lg border border-transparent shadow-lg transition-all"
            >
                <RotateCcw size={18} className="mr-2" />
                Novo Eleitor (Recarregar)
            </button>
            
            <button
               onClick={resetSimulation}
               className="text-xs text-red-400 hover:text-red-300 underline mt-4"
            >
              Resetar Tudo (Limpar Banco de Dados)
            </button>
        </div>
      </div>
    );
  }

  // Mining Steps Data
  const steps = [
    { text: "Propagando para Mempool...", icon: Database },
    { text: "Assinando transação (ECDSA)...", icon: ShieldCheck },
    { text: "Minerando Bloco (PoS/PoW)...", icon: Cpu },
    { text: "Confirmado na Blockchain!", icon: CheckCircle },
  ];

  // SCREEN 3: Voting Booth
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Wallet Info Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800 px-6 py-4 rounded-xl mb-8 border border-slate-700 shadow-lg gap-4 md:gap-0">
        <div className="flex items-center gap-3">
           <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
           <div className="flex flex-col">
             <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Identidade Digital (Wallet)</span>
             <span className="font-mono text-brand-400 text-sm">{wallet.address?.substring(0,8)}...{wallet.address?.substring(36)}</span>
           </div>
        </div>
        
        <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

        <div className="flex items-center gap-3">
           <div className="p-1.5 bg-slate-700 rounded text-slate-400">
             <User size={14} />
           </div>
           <div className="flex flex-col">
             <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Eleitor</span>
             <span className="font-mono text-white text-sm">{voterId}</span>
           </div>
        </div>

        <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

        <div className="flex items-center gap-4">
            <button 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-300 text-xs flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/20 transition-all"
                title="Cancelar Sessão"
            >
                <LogOut size={16} /> <span className="font-medium">Sair</span>
            </button>
        </div>
      </div>

      {wallet.isMining ? (
         <div className="flex flex-col items-center justify-center py-20 bg-slate-900 rounded-2xl border border-brand-500/30 backdrop-blur-sm relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-[60px]"></div>

            {/* Central Mining Visual */}
            <div className="relative mb-8">
              {/* Spinning Ring */}
              <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-brand-400 animate-spin"></div>
              {/* Inner Pulse */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/50 animate-ping"></div>
              {/* Center Box */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-slate-800 p-3 rounded-lg border border-brand-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse">
                    <Box className="text-brand-400" size={32} />
                 </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-6 animate-pulse">Processando Transação...</h3>
            
            {/* Vertical Steps Timeline */}
            <div className="w-full max-w-sm space-y-4">
               {steps.map((step, index) => {
                 const Icon = step.icon;
                 const isActive = index === miningStep;
                 const isCompleted = index < miningStep;
                 
                 return (
                   <div key={index} className={`flex items-center gap-4 transition-all duration-300 ${isActive || isCompleted ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}>
                     <div className={`p-2 rounded-full border transition-all duration-300 ${
                       isActive ? 'bg-brand-500 text-white border-brand-400 shadow-[0_0_10px_#0ea5e9]' : 
                       isCompleted ? 'bg-green-500 text-white border-green-400' : 'bg-slate-800 text-slate-500 border-slate-700'
                     }`}>
                       <Icon size={16} />
                     </div>
                     <span className={`text-sm font-mono transition-colors ${
                       isActive ? 'text-brand-400 font-bold shadow-brand-500/50' : 
                       isCompleted ? 'text-green-400' : 'text-slate-500'
                     }`}>
                       {step.text}
                     </span>
                     {isActive && (
                       <div className="ml-auto">
                         <Loader className="animate-spin text-brand-500" size={14} />
                       </div>
                     )}
                   </div>
                 );
               })}
            </div>
         </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              Cédula Eleitoral Digital
            </h2>
            <p className="text-slate-400">Escolha seu candidato abaixo. Esta ação criará uma transação na blockchain.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {candidates.map((candidate) => {
              const isBlank = candidate.id === 0;
              const isNull = candidate.id === -1;
              const isSpecial = isBlank || isNull;
              
              let borderColor = 'border-slate-700';
              let bgColor = 'bg-slate-800/50';
              let hoverColor = 'hover:border-slate-500';
              
              if (selectedCandidate === candidate.id) {
                 if (isBlank) borderColor = 'border-slate-300';
                 else if (isNull) borderColor = 'border-red-500';
                 else borderColor = 'border-brand-500';
                 
                 bgColor = 'bg-slate-800';
              } else {
                 hoverColor = 'hover:bg-slate-800';
                 if (isNull) hoverColor += ' hover:border-red-500/50';
              }

              return (
              <div 
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={`relative cursor-pointer transition-all duration-200 rounded-xl overflow-hidden border-2 group ${borderColor} ${bgColor} ${hoverColor} ${
                  selectedCandidate === candidate.id ? 'shadow-2xl scale-105 z-10' : ''
                }`}
              >
                <div className={`h-36 relative overflow-hidden flex items-center justify-center ${
                    isBlank ? 'bg-slate-200' : isNull ? 'bg-red-900/20' : 'bg-slate-700'
                }`}>
                    {isBlank ? (
                      <div className="flex flex-col items-center justify-center text-slate-500">
                          <FileMinus size={40} strokeWidth={1.5} />
                          <span className="font-bold text-sm mt-2 uppercase tracking-wide">Em Branco</span>
                      </div>
                    ) : isNull ? (
                      <div className="flex flex-col items-center justify-center text-red-400">
                          <Ban size={40} strokeWidth={1.5} />
                          <span className="font-bold text-sm mt-2 uppercase tracking-wide">Anular Voto</span>
                      </div>
                    ) : (
                      <>
                        <img 
                            src={candidate.image} 
                            alt={candidate.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      </>
                    )}
                    
                    {!isSpecial && (
                      <div className="absolute bottom-2 left-3">
                          <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tighter">
                            {candidate.id.toString().padStart(2, '0')}
                          </span>
                      </div>
                    )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-0.5 leading-tight">{candidate.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-xs font-medium">{candidate.party}</p>
                    {selectedCandidate === candidate.id && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider animate-pulse ${
                          isBlank ? 'text-white' : isNull ? 'text-red-400' : 'text-brand-400'
                      }`}>Selecionado</span>
                    )}
                  </div>
                </div>
                {selectedCandidate === candidate.id && (
                    <div className={`absolute top-2 right-2 text-white rounded-full p-1 shadow-lg ${
                        isBlank ? 'bg-slate-500' : isNull ? 'bg-red-600' : 'bg-brand-500'
                    }`}>
                        <CheckCircle size={16} />
                    </div>
                )}
              </div>
            )})}
          </div>

          <div className="mt-12 flex justify-end">
            <button
              disabled={selectedCandidate === null}
              onClick={handleVoteClick}
              className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                selectedCandidate === null
                  ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  : selectedCandidate === 0 
                    ? 'bg-slate-200 text-slate-800 hover:bg-white hover:shadow-xl hover:shadow-white/10 transform hover:-translate-y-1'
                    : selectedCandidate === -1
                    ? 'bg-red-600 text-white hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/20 transform hover:-translate-y-1'
                    : 'bg-gradient-to-r from-brand-600 to-purple-600 text-white hover:shadow-xl hover:shadow-brand-500/30 transform hover:-translate-y-1 border border-transparent'
              }`}
            >
              {selectedCandidate === null ? (
                'Selecione uma Opção para Habilitar'
              ) : (
                <>
                  <ShieldCheck size={24} />
                  CONFIRMAR E ASSINAR VOTO
                </>
              )}
            </button>
          </div>
          <div className="mt-6 flex items-start gap-3 text-yellow-500/80 text-sm bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
             <AlertTriangle size={20} className="shrink-0 mt-0.5" />
             <p><strong>Aviso de Imutabilidade:</strong> Ao confirmar, seu voto será assinado digitalmente com sua chave privada e propagado para a rede. Após a mineração do bloco, esta ação torna-se irreversível e auditável publicamente.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default VotingSimulator;