import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThesisViewer from './components/ThesisViewer';
import VotingSimulator from './components/VotingSimulator';
import AuditDashboard from './components/AuditDashboard';
import References from './components/References';
import { AppSection, Candidate, WalletState, Transaction } from './types';

// --- CONSTANTS ---
const STORAGE_PREFIX = 'tcc_v3_';

const INITIAL_CANDIDATES: Candidate[] = [
  { id: 3, name: "Ana Souza", party: "Frente Blockchain", image: "https://picsum.photos/400/300?random=3", votes: 125 },
  { id: 1, name: "Maria Silva", party: "Partido da Inovação", image: "https://picsum.photos/400/300?random=1", votes: 124 },
  { id: 2, name: "João Santos", party: "União Digital", image: "https://picsum.photos/400/300?random=2", votes: 123 },
  { id: 0, name: "Voto em Branco", party: "Abstenção", image: "", votes: 15 },
  { id: -1, name: "Voto Nulo", party: "Anulado", image: "", votes: 8 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
    { hash: "0x8a3b...9c2d", blockNumber: 12401, from: "0x71C...9A21", to: "0xContract", timestamp: "10:02:15", gasUsed: 21000, candidateId: 3 },
    { hash: "0x1d4f...2e3a", blockNumber: 12402, from: "0x3B2...4C11", to: "0xContract", timestamp: "10:05:33", gasUsed: 21000, candidateId: 1 },
    { hash: "0x9c1a...5b6d", blockNumber: 12405, from: "0x1A9...8D44", to: "0xContract", timestamp: "10:12:01", gasUsed: 21500, candidateId: 3 },
    { hash: "0xb2f1...7a9c", blockNumber: 12404, from: "0x5E2...2B99", to: "0xContract", timestamp: "10:09:42", gasUsed: 21000, candidateId: 0 },
    { hash: "0xe4d2...1b8f", blockNumber: 12407, from: "0x9F1...3C77", to: "0xContract", timestamp: "10:15:22", gasUsed: 21000, candidateId: -1 },
];

const INITIAL_WALLET: WalletState = {
  isConnected: false,
  address: null,
  hasVoted: false,
  isMining: false
};

// --- CUSTOM HOOK ---
// Abstrai a lógica de ler/salvar no localStorage automaticamente
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
  
  // State Management with Custom Hook (Cleaner & DRY)
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', INITIAL_TRANSACTIONS);
  const [usedVoterIds, setUsedVoterIds] = useLocalStorage<string[]>('used_voter_ids', []);
  const [wallet, setWallet] = useLocalStorage<WalletState>('wallet', INITIAL_WALLET);

  // Actions wrapped in useCallback to prevent unnecessary child re-renders
  const connectWallet = useCallback(() => {
    const randomHex = Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    // FIX: Force a completely fresh state object. 
    // Do NOT use '...prev' here, as it might carry over 'hasVoted: true' from a previous session.
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

  const resetSimulation = useCallback(() => {
    // Clear storage via the setters (which update localStorage automatically)
    setCandidates(INITIAL_CANDIDATES);
    setTransactions(INITIAL_TRANSACTIONS);
    setUsedVoterIds([]);
    setWallet(INITIAL_WALLET);
  }, [setCandidates, setTransactions, setUsedVoterIds, setWallet]);

  const castVote = useCallback((candidateId: number, voterId: string) => {
    setWallet(prev => ({ ...prev, isMining: true }));

    // Simulate Network Latency
    setTimeout(() => {
      // 1. Update Candidates
      setCandidates(curr => curr.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));

      // 2. Create Transaction
      setTransactions(curr => [
        ...curr,
        {
          hash: `0x${Math.random().toString(16).substr(2, 40)}`,
          blockNumber: 12406 + curr.length,
          from: wallet.address || "0xUnknown", 
          to: "0xContractVoting",
          timestamp: new Date().toLocaleTimeString(),
          gasUsed: 21000 + Math.floor(Math.random() * 1000),
          candidateId
        }
      ]);

      // 3. Mark Voter ID
      setUsedVoterIds(prev => [...prev, voterId]);

      // 4. Update Wallet
      setWallet(prev => ({ ...prev, isMining: false, hasVoted: true }));
    }, 3500);
  }, [setCandidates, setTransactions, setUsedVoterIds, setWallet, wallet.address]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar currentSection={currentSection} setSection={setSection} />
      
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
        {currentSection === AppSection.REFERENCES && <References />}
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