import { supabase } from '../supabaseClient';
import { Candidate, Transaction, Evaluation } from '../types';

// --- MODEL LAYER ---
// Responsável estritamente pela comunicação com o Banco de Dados (Supabase)

export const VotingService = {
  // --- READ OPERATIONS ---
  async fetchCandidates(localCandidates: Candidate[]) {
    if (!supabase) return null;
    const { data } = await supabase
      .from('candidates')
      .select('*')
      .order('votes', { ascending: false });
    
    if (data && data.length > 0) {
      // Merge: Usa dados do banco, mas mantém imagens locais (se o banco só tiver texto)
      return data.map((rc: any) => {
        const local = localCandidates.find(c => c.id === rc.id);
        return { ...rc, image: local?.image || "" };
      });
    }
    return null;
  },

  async fetchTransactions(initialTransactions: Transaction[]) {
    if (!supabase) return null;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('id', { ascending: true });

    if (data && data.length > 0) {
      const mappedTx = data.map((tx: any) => ({
        hash: tx.hash,
        blockNumber: tx.block_number,
        from: tx.from_address,
        to: "0xContract",
        timestamp: tx.timestamp,
        gasUsed: tx.gas_used,
        candidateId: tx.candidate_id
      }));
      return [...initialTransactions, ...mappedTx];
    }
    return null;
  },

  async fetchVoters() {
    if (!supabase) return null;
    const { data } = await supabase.from('voters').select('voter_id');
    if (data) return data.map((v: any) => v.voter_id);
    return null;
  },

  async fetchEvaluations() {
    if (!supabase) return null;
    const { data } = await supabase
      .from('evaluations')
      .select('*')
      .order('id', { ascending: false });
    return data || [];
  },

  // --- WRITE OPERATIONS ---
  async registerVote(candidateId: number, voterId: string, txData: any, currentVotes: number) {
    if (!supabase) return;

    try {
      // 1. Tenta usar RPC (Stored Procedure) para incremento atômico
      const { error: voteError } = await supabase.rpc('increment_vote', { row_id: candidateId });
      
      // Fallback: Update manual se RPC falhar
      if (voteError) {
        await supabase.from('candidates').update({ votes: currentVotes + 1 }).eq('id', candidateId);
      }

      // 2. Registra Transação
      await supabase.from('transactions').insert({
        hash: txData.hash,
        block_number: txData.blockNumber,
        from_address: txData.from,
        timestamp: txData.timestamp,
        gas_used: txData.gasUsed,
        candidate_id: candidateId
      });

      // 3. Registra Eleitor
      await supabase.from('voters').insert({ voter_id: voterId });

    } catch (err) {
      console.error("Erro no Model VotingService.registerVote:", err);
      throw err;
    }
  },

  async saveEvaluation(evaluation: Omit<Evaluation, 'id'>) {
    if (!supabase) return;
    await supabase.from('evaluations').insert({
      name: evaluation.name,
      grade: evaluation.grade,
      comment: evaluation.comment,
      timestamp: evaluation.timestamp
    });
  },

  // --- MAINTENANCE OPERATIONS ---
  async resetDatabase(initialCandidates: Candidate[]) {
    if (!supabase) return;
    
    // 1. Limpar Transações
    await supabase.from('transactions').delete().neq('id', -1);
    
    // 2. Limpar Eleitores
    await supabase.from('voters').delete().neq('id', -1);

    // 3. Zerar votos
    for (const candidate of initialCandidates) {
      await supabase
        .from('candidates')
        .update({ votes: 0 })
        .eq('id', candidate.id);
    }
  },

  subscribeToChanges(
    onCandidateUpdate: (payload: any) => void,
    onTransactionInsert: (payload: any) => void,
    onEvaluationInsert: (payload: any) => void
  ) {
    if (!supabase) return null;

    return supabase.channel('realtime_votes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'candidates' }, onCandidateUpdate)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, onTransactionInsert)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'evaluations' }, onEvaluationInsert)
      .subscribe();
  },

  removeChannel(channel: any) {
    if (supabase && channel) {
      supabase.removeChannel(channel);
    }
  }
};