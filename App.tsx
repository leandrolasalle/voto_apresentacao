import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThesisViewer from './components/ThesisViewer';
import VotingSimulator from './components/VotingSimulator';
import AuditDashboard from './components/AuditDashboard';
import References from './components/References';
import { AppSection, Candidate, WalletState, Transaction, Evaluation } from './types';
import { supabase } from './supabaseClient';

// --- CONSTANTS ---
const STORAGE_PREFIX = 'tcc_v3_';

// ATUALIZAÇÃO: Iniciar com 0 votos para simulação real
const INITIAL_CANDIDATES: Candidate[] = [
  { id: 3, name: "Ana Souza", party: "Frente Blockchain", image: "https://picsum.photos/400/300?random=3", votes: 0 },
  { id: 1, name: "Maria Silva", party: "Partido da Inovação", image: "https://picsum.photos/400/300?random=1", votes: 0 },
  { id: 2, name: "João Santos", party: "União Digital", image: "https://picsum.photos/400/300?random=2", votes: 0 },
  { id: 0, name: "Voto em Branco", party: "Abstenção", image: "", votes: 0 },
  { id: -1, name: "Voto Nulo", party: "Anulado", image: "", votes: 0 },
];

// ATUALIZAÇÃO: Iniciar sem transações prévias
const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_WALLET: WalletState = {
  isConnected: false,
  address: null,
  hasVoted: false,
  isMining: false
};

const INITIAL_EVALUATIONS: Evaluation[] = [
  { id: 1, name: "Prof. Alessandro", grade: 10, comment: "Excelente demonstração prática dos conceitos de Blockchain.", timestamp: "2024-05-20 14:30" },
  { id: 2, name: "Visitante", grade: 9, comment: "Interface muito intuitiva, parabéns.", timestamp: "2024-05-21 09:15" }
];

// --- CUSTOM HOOK FOR LOCAL STORAGE ---
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const prefixedKey = STORAGE_PREFIX + key;
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey]);

  return [storedValue, setValue];
}

function App() {
  const [currentSection, setSection] = useState<AppSection>(AppSection.HOME);
  
  // State initialization (Hybrid: Starts with local, updates from cloud if available)
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', INITIAL_TRANSACTIONS);
  const [evaluations, setEvaluations] = useLocalStorage<Evaluation[]>('evaluations', INITIAL_EVALUATIONS);
  const [usedVoterIds, setUsedVoterIds] = useLocalStorage<string[]>('used_voter_ids', []);
  const [wallet, setWallet] = useLocalStorage<WalletState>('wallet', INITIAL_WALLET);

  // --- SUPABASE SYNC ---
  // If Supabase is connected, fetch real data from cloud
  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      // 1. Fetch Candidates
      const { data: remoteCandidates } = await supabase
        .from('candidates')
        .select('*')
        .order('votes', { ascending: false });
      
      if (remoteCandidates && remoteCandidates.length > 0) {
        // Merge with local images since DB only has text data usually (simplified)
        const mergedCandidates = remoteCandidates.map((rc: any) => {
           const local = INITIAL_CANDIDATES.find(c => c.id === rc.id);
           return { ...rc, image: local?.image || "" };
        });
        setCandidates(mergedCandidates);
      }

      // 2. Fetch Transactions
      const { data: remoteTx } = await supabase
        .from('transactions')
        .select('*')
        .order('id', { ascending: true }); // Show oldest first so we can append

      if (remoteTx && remoteTx.length > 0) {
        const mappedTx = remoteTx.map((tx: any) => ({
           hash: tx.hash,
           blockNumber: tx.block_number,
           from: tx.from_address,
           to: "0xContract",
           timestamp: tx.timestamp,
           gasUsed: tx.gas_used,
           candidateId: tx.candidate_id
        }));
        // Combine initial demo transactions with real ones
        setTransactions([...INITIAL_TRANSACTIONS, ...mappedTx]);
      }

      // 3. Fetch Voters (Simple ID check)
      const { data: remoteVoters } = await supabase.from('voters').select('voter_id');
      if (remoteVoters) {
        setUsedVoterIds(remoteVoters.map((v: any) => v.voter_id));
      }

      // 4. Fetch Evaluations
      const { data: remoteEvaluations } = await supabase
        .from('evaluations')
        .select('*')
        .order('id', { ascending: false });
        
      if (remoteEvaluations && remoteEvaluations.length > 0) {
        setEvaluations(remoteEvaluations);
      }
    };

    fetchData();

    // Optional: Realtime subscription could go here
    const channel = supabase.channel('realtime_votes')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'candidates' }, (payload) => {
        setCandidates(curr => curr.map(c => c.id === payload.new.id ? { ...c, votes: payload.new.votes } : c));
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
        const newTx = payload.new;
        setTransactions(curr => [...curr, {
           hash: newTx.hash,
           blockNumber: newTx.block_number,
           from: newTx.from_address,
           to: "0xContract",
           timestamp: newTx.timestamp,
           gasUsed: newTx.gas_used,
           candidateId: newTx.candidate_id
        }]);
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'evaluations' }, (payload) => {
      setEvaluations(curr => [payload.new, ...curr]);
    })
    .subscribe();

    return () => {
        supabase.removeChannel(channel);
    }

  }, [setCandidates, setTransactions, setUsedVoterIds, setEvaluations]);


  const connectWallet = useCallback(() => {
    const randomHex = Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    setWallet({
      isConnected: true, 
      address: `0x${randomHex}`,
      hasVoted: false,
      isMining: false
    });
  }, [setWallet]);

  const resetVoterSession = useCallback(() => {
    setWallet(INITIAL_WALLET);
  }, [setWallet]);

  const resetSimulation = useCallback(async () => {
    // Local Reset
    setCandidates(INITIAL_CANDIDATES);
    setTransactions(INITIAL_TRANSACTIONS);
    setUsedVoterIds([]);
    setWallet(INITIAL_WALLET);
    // Nota: Não resetamos as avaliações (Guestbook) para manter o feedback

    // Cloud Reset (Supabase)
    if (supabase) {
        const confirmReset = window.confirm("ATENÇÃO: Isso apagará TODOS os votos e transações do banco de dados na nuvem. Deseja zerar o sistema?");
        
        if (confirmReset) {
            try {
                // 1. Limpar Transações
                // .neq('id', -1) é um hack para deletar tudo (id not equal to -1)
                await supabase.from('transactions').delete().neq('id', -1);
                
                // 2. Limpar Eleitores que já votaram
                await supabase.from('voters').delete().neq('id', -1);

                // 3. Zerar votos dos Candidatos
                // Precisamos atualizar um por um ou via query, aqui faremos um loop simples
                for (const candidate of INITIAL_CANDIDATES) {
                    await supabase
                        .from('candidates')
                        .update({ votes: 0 })
                        .eq('id', candidate.id);
                }

                alert("Sistema zerado com sucesso! O banco de dados está pronto para nova votação.");
                
                // Forçar recarregamento para limpar estados residuais
                window.location.reload();

            } catch (err) {
                console.error("Erro ao resetar banco:", err);
                alert("Erro ao tentar limpar o banco de dados. Verifique o console ou as permissões (RLS).");
            }
        }
    } else {
        alert("Simulação local resetada.");
    }
  }, [setCandidates, setTransactions, setUsedVoterIds, setWallet]);

  const submitEvaluation = useCallback(async (newEval: Omit<Evaluation, 'id'>) => {
    // 1. Optimistic Update (Local)
    const tempId = Date.now();
    const evaluationWithId = { ...newEval, id: tempId };
    
    setEvaluations(prev => [evaluationWithId, ...prev]);

    // 2. Supabase Insert
    if (supabase) {
      try {
        await supabase.from('evaluations').insert({
          name: newEval.name,
          grade: newEval.grade,
          comment: newEval.comment,
          timestamp: newEval.timestamp
        });
        // The realtime subscription will handle the update with the real ID
      } catch (err) {
        console.error("Error saving evaluation:", err);
      }
    }
  }, [setEvaluations]);

  const castVote = useCallback(async (candidateId: number, voterId: string) => {
    setWallet(prev => ({ ...prev, isMining: true }));

    // Transaction Data
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    const blockNum = 12406 + transactions.length;
    const gas = 21000 + Math.floor(Math.random() * 1000);
    const time = new Date().toLocaleTimeString();
    const fromAddr = wallet.address || "0xUnknown";

    // Simulate Network Latency (Mining)
    setTimeout(async () => {
      
      if (supabase) {
          // --- CLOUD MODE ---
          try {
             // 1. Register Vote (RPC Call equivalent)
             const { error: voteError } = await supabase.rpc('increment_vote', { row_id: candidateId });
             
             // Fallback if RPC not set up: manual update (less safe but works for demo)
             if (voteError) {
                 const current = candidates.find(c => c.id === candidateId);
                 // Se não encontrou localmente, assume 0
                 const currentVotes = current ? current.votes : 0;
                 await supabase.from('candidates').update({ votes: currentVotes + 1 }).eq('id', candidateId);
             }

             // 2. Register Transaction (Ledger)
             await supabase.from('transactions').insert({
                 hash: txHash,
                 block_number: blockNum,
                 from_address: fromAddr,
                 timestamp: time,
                 gas_used: gas,
                 candidate_id: candidateId
             });

             // 3. Register Voter
             await supabase.from('voters').insert({ voter_id: voterId });

          } catch (err) {
              console.error("Cloud sync failed, falling back to local for UI", err);
          }
      }

      // --- LOCAL OPTIMISTIC UPDATE (Visual feedback immediate) ---
      // 1. Update Candidates
      setCandidates(curr => curr.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));

      // 2. Create Transaction
      setTransactions(curr => [
        ...curr,
        {
          hash: txHash,
          blockNumber: blockNum,
          from: fromAddr, 
          to: "0xContractVoting",
          timestamp: time,
          gasUsed: gas,
          candidateId
        }
      ]);

      // 3. Mark Voter ID
      setUsedVoterIds(prev => [...prev, voterId]);

      // 4. Update Wallet
      setWallet(prev => ({ ...prev, isMining: false, hasVoted: true }));
      
    }, 3500);
  }, [setCandidates, setTransactions, setUsedVoterIds, setWallet, wallet.address, candidates, transactions.length]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar currentSection={currentSection} setSection={setSection} />
      
      {/* Cloud Status Indicator */}
      {supabase && (
        <div className="bg-brand-900/30 text-brand-300 text-xs text-center py-1 border-b border-brand-500/20">
            🟢 Modo Online: Sincronizado com Banco de Dados em Nuvem (Supabase)
        </div>
      )}

      <main className="animate-fadeIn">
        {currentSection === AppSection.HOME && <Hero setSection={setSection} />}
        {currentSection === AppSection.THESIS && <ThesisViewer />}
        {currentSection === AppSection.VOTING_DEMO && (
          <VotingSimulator 
            candidates={candidates} 
            wallet={wallet} 
            connectWallet={connectWallet}
            castVote={castVote}
            transactions={transactions}
            resetSimulation={resetSimulation}
            resetVoterSession={resetVoterSession}
            usedVoterIds={usedVoterIds}
          />
        )}
        {currentSection === AppSection.AUDIT && (
          <AuditDashboard candidates={candidates} transactions={transactions} />
        )}
        {currentSection === AppSection.REFERENCES && (
          <References evaluations={evaluations} onSubmitEvaluation={submitEvaluation} />
        )}
      </main>

      {currentSection !== AppSection.HOME && (
        <footer className="border-t border-slate-800 py-6 mt-12 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2025 Projeto de TCC - Sistemas de Informação - UniLaSalle RJ</p>
            <p>Desenvolvido com base no trabalho de Leandro Santos Teixeira e Paulo Ricardo Tebet Lyrio</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;