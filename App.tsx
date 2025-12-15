import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThesisViewer from './components/ThesisViewer';
import VotingSimulator from './components/VotingSimulator';
import AuditDashboard from './components/AuditDashboard';
import References from './components/References';
import { AppSection } from './types';
import { useAppController } from './controllers/useAppController';

// --- MAIN VIEW ---
// Agora o App.tsx é limpo e foca apenas na composição da interface.
// Toda a lógica de estado e banco de dados está no Controller.

function App() {
  const { state, actions } = useAppController();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar currentSection={state.currentSection} setSection={actions.setSection} />
      
      {/* View Logic: Status Indicator */}
      {state.isOnline ? (
        <div className="bg-brand-900/30 text-brand-300 text-xs text-center py-1 border-b border-brand-500/20 flex items-center justify-center gap-2 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Modo Online: Sincronizado com Banco de Dados em Nuvem (Supabase)
        </div>
      ) : (
        <div className="bg-slate-800 text-slate-400 text-xs text-center py-1 border-b border-slate-700 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-slate-500"></div>
            Modo Simulação Local (Offline) - Configure o arquivo .env e supabase_setup.sql para ativar o Realtime.
        </div>
      )}

      <main className="animate-fadeIn">
        {state.currentSection === AppSection.HOME && (
          <Hero setSection={actions.setSection} />
        )}
        
        {state.currentSection === AppSection.THESIS && (
          <ThesisViewer />
        )}
        
        {state.currentSection === AppSection.VOTING_DEMO && (
          <VotingSimulator 
            candidates={state.candidates} 
            wallet={state.wallet} 
            connectWallet={actions.connectWallet}
            castVote={actions.castVote}
            transactions={state.transactions}
            resetSimulation={actions.resetSimulation}
            resetVoterSession={actions.resetVoterSession}
            usedVoterIds={state.usedVoterIds}
          />
        )}
        
        {state.currentSection === AppSection.AUDIT && (
          <AuditDashboard 
            candidates={state.candidates} 
            transactions={state.transactions} 
          />
        )}
        
        {state.currentSection === AppSection.REFERENCES && (
          <References 
            evaluations={state.evaluations} 
            onSubmitEvaluation={actions.submitEvaluation} 
          />
        )}
      </main>

      {state.currentSection !== AppSection.HOME && (
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