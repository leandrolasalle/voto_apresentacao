import { useState, useEffect, useCallback } from 'react';
import { AppSection, Candidate, WalletState, Transaction, Evaluation } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { VotingService } from '../models/VotingService';
import { supabase } from '../supabaseClient';

// --- INITIAL CONSTANTS (Model Configuration) ---
const INITIAL_CANDIDATES: Candidate[] = [
  { id: 3, name: "Ana Souza", party: "Frente Blockchain", image: "https://picsum.photos/400/300?random=3", votes: 0 },
  { id: 1, name: "Maria Silva", party: "Partido da Inovação", image: "https://picsum.photos/400/300?random=1", votes: 0 },
  { id: 2, name: "João Santos", party: "União Digital", image: "https://picsum.photos/400/300?random=2", votes: 0 },
  { id: 0, name: "Voto em Branco", party: "Abstenção", image: "", votes: 0 },
  { id: -1, name: "Voto Nulo", party: "Anulado", image: "", votes: 0 },
];

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

// --- CONTROLLER HOOK ---
export function useAppController() {
  // Navigation State
  const [currentSection, setSection] = useState<AppSection>(AppSection.HOME);

  // Business Data State (Persisted locally for offline support + Latency compensation)
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', INITIAL_TRANSACTIONS);
  const [evaluations, setEvaluations] = useLocalStorage<Evaluation[]>('evaluations', INITIAL_EVALUATIONS);
  const [usedVoterIds, setUsedVoterIds] = useLocalStorage<string[]>('used_voter_ids', []);
  const [wallet, setWallet] = useLocalStorage<WalletState>('wallet', INITIAL_WALLET);

  // --- 1. SYNC LOGIC (Controller calls Model) ---
  useEffect(() => {
    if (!supabase) return;

    const syncData = async () => {
      const remoteCandidates = await VotingService.fetchCandidates(INITIAL_CANDIDATES);
      if (remoteCandidates) setCandidates(remoteCandidates);

      const remoteTransactions = await VotingService.fetchTransactions(INITIAL_TRANSACTIONS);
      if (remoteTransactions) setTransactions(remoteTransactions);

      const remoteVoters = await VotingService.fetchVoters();
      if (remoteVoters) setUsedVoterIds(remoteVoters);

      const remoteEvals = await VotingService.fetchEvaluations();
      if (remoteEvals && remoteEvals.length > 0) setEvaluations(remoteEvals);
    };

    syncData();

    // Realtime Subscriptions
    const channel = VotingService.subscribeToChanges(
      (payload) => { // On Candidate Update
         setCandidates(curr => curr.map(c => c.id === payload.new.id ? { ...c, votes: payload.new.votes } : c));
      },
      (payload) => { // On Transaction Insert
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
      },
      (payload) => { // On Evaluation Insert
        setEvaluations(curr => [payload.new, ...curr]);
      }
    );

    return () => {
      VotingService.removeChannel(channel);
    }
  }, [setCandidates, setTransactions, setUsedVoterIds, setEvaluations]);

  // --- 2. ACTION HANDLERS (Business Logic) ---

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
    // Local State Reset
    setCandidates(INITIAL_CANDIDATES);
    setTransactions(INITIAL_TRANSACTIONS);
    setUsedVoterIds([]);
    setWallet(INITIAL_WALLET);

    // Model Reset (Cloud)
    if (supabase) {
        const confirmReset = window.confirm("ATENÇÃO: Isso apagará TODOS os votos e transações do banco de dados na nuvem. Deseja zerar o sistema?");
        if (confirmReset) {
            try {
                await VotingService.resetDatabase(INITIAL_CANDIDATES);
                alert("Sistema zerado com sucesso! O banco de dados está pronto para nova votação.");
                window.location.reload();
            } catch (err) {
                console.error("Erro ao resetar banco:", err);
                alert("Erro ao tentar limpar o banco de dados.");
            }
        }
    } else {
        alert("Simulação local resetada.");
    }
  }, [setCandidates, setTransactions, setUsedVoterIds, setWallet]);

  const submitEvaluation = useCallback(async (newEval: Omit<Evaluation, 'id'>) => {
    // Optimistic Update
    const tempId = Date.now();
    setEvaluations(prev => [{ ...newEval, id: tempId }, ...prev]);
    // Model Update
    await VotingService.saveEvaluation(newEval);
  }, [setEvaluations]);

  const castVote = useCallback(async (candidateId: number, voterId: string) => {
    setWallet(prev => ({ ...prev, isMining: true }));

    // Prepare Transaction Data
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    const blockNum = 12406 + transactions.length;
    const gas = 21000 + Math.floor(Math.random() * 1000);
    const time = new Date().toLocaleTimeString();
    const fromAddr = wallet.address || "0xUnknown";

    const txData = {
        hash: txHash,
        blockNumber: blockNum,
        from: fromAddr,
        timestamp: time,
        gasUsed: gas
    };

    // Simulate Mining Latency
    setTimeout(async () => {
      // Model Update (Cloud)
      const currentCandidate = candidates.find(c => c.id === candidateId);
      await VotingService.registerVote(candidateId, voterId, txData, currentCandidate?.votes || 0);

      // Local Update (Optimistic)
      setCandidates(curr => curr.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));
      setTransactions(curr => [...curr, { ...txData, to: "0xContractVoting", candidateId }]);
      setUsedVoterIds(prev => [...prev, voterId]);
      setWallet(prev => ({ ...prev, isMining: false, hasVoted: true }));
      
    }, 3500);
  }, [setCandidates, setTransactions, setUsedVoterIds, setWallet, wallet.address, candidates, transactions.length]);

  // Return Public API for the View
  return {
    state: {
      currentSection,
      candidates,
      transactions,
      evaluations,
      usedVoterIds,
      wallet,
      isOnline: !!supabase
    },
    actions: {
      setSection,
      connectWallet,
      castVote,
      resetSimulation,
      resetVoterSession,
      submitEvaluation
    }
  };
}