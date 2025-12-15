import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Box, Hash, Clock, Database, Eye, X, FileCode, CheckCircle, ArrowRight } from 'lucide-react';
import { Candidate, Transaction } from '../types';

interface AuditDashboardProps {
  candidates: Candidate[];
  transactions: Transaction[];
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const AuditDashboard: React.FC<AuditDashboardProps> = ({ candidates, transactions }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  // OPTIMIZATION: Memoize expensive calculations
  const { totalVotes, sortedCandidates } = useMemo(() => {
    const safeCandidates = candidates || [];
    const total = safeCandidates.reduce((acc, curr) => acc + curr.votes, 0);
    const sorted = [...safeCandidates].sort((a, b) => b.votes - a.votes);
    return { totalVotes: total, sortedCandidates: sorted };
  }, [candidates]);

  // Color logic based on ID persistence
  const getCandidateColor = (id: number) => {
    if (id === 0) return '#cbd5e1'; // Blank
    if (id === -1) return '#dc2626'; // Null
    if (id > 0) return COLORS[(id - 1) % COLORS.length];
    return COLORS[0];
  };

  const getCandidateName = (id: number) => {
    const candidate = candidates.find(c => c.id === id);
    return candidate ? candidate.name : 'Unknown Candidate';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Painel de Auditoria Pública</h2>
            <p className="text-slate-400">Visualização em tempo real do Smart Contract (RF05 - Auditoria)</p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total de Votos Computados</div>
            <div className="text-3xl font-mono text-brand-400 font-bold">{totalVotes}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Results Section */}
        <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database size={20} className="text-brand-400"/> Apuração em Tempo Real
          </h3>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Force re-animation only when total votes change */}
              <BarChart key={`chart-${totalVotes}`} layout="vertical" data={sortedCandidates} margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{fill: '#e2e8f0', fontSize: 11, width: 100}} 
                    interval={0}
                />
                <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9'}}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000}>
                  {sortedCandidates.map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={getCandidateColor(entry.id)} />
                  ))}
                  <LabelList dataKey="votes" position="right" fill="#94a3b8" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
             {sortedCandidates.map((c, i) => (
               <div key={c.id} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2 transition-all hover:bg-slate-700/30 px-2 rounded">
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 w-4">#{i + 1}</span>
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: getCandidateColor(c.id)}}></div>
                    <span className="text-slate-300">{c.name}</span>
                 </div>
                 <span className="font-mono font-bold text-white">{c.votes} votos</span>
               </div>
             ))}
             <div className="pt-2 flex justify-between text-brand-400 font-bold border-t border-slate-700 mt-4 pt-4 px-2">
               <span>Total Computado</span>
               <span>{totalVotes}</span>
             </div>
          </div>
        </div>

        {/* Blockchain Ledger Section */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Hash size={20} className="text-purple-400"/> Livro-Razão (Ledger)
              </h3>
              <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                Network: Localhost:8545
              </span>
           </div>
           
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-slate-700">
                  <th className="px-4 py-3">Hash da Transação</th>
                  <th className="px-4 py-3">Bloco</th>
                  <th className="px-4 py-3">De (Carteira)</th>
                  <th className="px-4 py-3 text-right">Gas Used</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                {!transactions || transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 italic">
                      Nenhum voto registrado na blockchain ainda.
                    </td>
                  </tr>
                ) : (
                  transactions.slice().reverse().map((tx, idx) => (
                    <tr key={tx.hash || idx} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors group animate-fadeIn">
                      <td className="px-4 py-3 text-brand-400 max-w-[140px] truncate cursor-pointer hover:underline" onClick={() => setSelectedTx(tx)} title="Ver detalhes da transação">
                        {tx.hash}
                      </td>
                      <td className="px-4 py-3 text-purple-400 flex items-center gap-1">
                        <Box size={14} /> {tx.blockNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-[120px] truncate" title={tx.from}>
                        {tx.from}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-right">
                        {tx.gasUsed}
                      </td>
                      <td className="px-4 py-3 text-right">
                         <button 
                            onClick={() => setSelectedTx(tx)}
                            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-600 rounded transition-all"
                            title="Inspecionar Operação Completa"
                         >
                            <Eye size={16} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
             * Clique no hash ou no ícone de olho para inspecionar os dados brutos da transação (Input Data).
          </p>
        </div>
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedTx(null)}></div>
          
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-full max-w-3xl relative z-10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800 rounded-t-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCode className="text-brand-400" /> Detalhes da Transação
              </h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 font-sans">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">Status:</div>
                 <div className="col-span-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                       <CheckCircle size={12} className="mr-1.5" /> Success
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold flex items-center gap-1">Transaction Hash:</div>
                 <div className="col-span-3 text-white font-mono text-sm break-all select-all">{selectedTx.hash}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">Block:</div>
                 <div className="col-span-3 flex items-center gap-2 text-brand-400 text-sm font-mono">
                    <Box size={14} /> {selectedTx.blockNumber} 
                    <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-700 rounded ml-2">12 Confirmations</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">Timestamp:</div>
                 <div className="col-span-3 text-white text-sm flex items-center gap-2">
                    <Clock size={14} /> {selectedTx.timestamp}
                 </div>
              </div>

              <div className="border-t border-slate-700 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">From:</div>
                 <div className="col-span-3 flex items-center gap-2 text-brand-400 text-sm font-mono break-all">
                    {selectedTx.from}
                    <span className="text-slate-500 font-sans text-xs ml-auto">(Eleitor)</span>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">To:</div>
                 <div className="col-span-3 flex items-center gap-2 text-brand-400 text-sm font-mono break-all">
                    {selectedTx.to} 
                    <CheckCircle size={12} className="text-blue-500" />
                    <span className="text-slate-500 font-sans text-xs ml-auto">(Smart Contract)</span>
                 </div>
              </div>

              <div className="border-t border-slate-700 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">Value:</div>
                 <div className="col-span-3 text-white text-sm font-mono">0.00 ETH</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 text-slate-400 text-sm font-semibold">Transaction Fee:</div>
                 <div className="col-span-3 text-slate-300 text-sm font-mono">
                    {(selectedTx.gasUsed * 0.00000002).toFixed(8)} ETH <span className="text-slate-500 text-xs">({selectedTx.gasUsed} Gas Used)</span>
                 </div>
              </div>

              <div className="bg-slate-900 rounded-lg border border-slate-700 mt-4 overflow-hidden">
                 <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-slate-300 font-bold text-sm">Input Data</span>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Function: vote(uint256 candidateId)</span>
                 </div>
                 <div className="p-4 font-mono text-xs md:text-sm overflow-x-auto text-slate-300 space-y-2">
                    <div className="flex gap-4">
                        <span className="text-slate-500 w-24 shrink-0">MethodID:</span>
                        <span className="text-yellow-400">0x0121b93f</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-slate-500 w-24 shrink-0">[0]:</span>
                        <div>
                            <span className="text-purple-400 block mb-1">
                                000000000000000000000000000000000000000000000000000000000000000{selectedTx.candidateId}
                            </span>
                            <div className="flex items-center gap-2 text-slate-400 font-sans bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                <ArrowRight size={14} />
                                <span>Decoded: <strong>Candidate ID {selectedTx.candidateId}</strong></span>
                                <span className="text-brand-400">({getCandidateName(selectedTx.candidateId)})</span>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800 border-t border-slate-700 rounded-b-xl flex justify-end">
               <button onClick={() => setSelectedTx(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
                 Fechar
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditDashboard;