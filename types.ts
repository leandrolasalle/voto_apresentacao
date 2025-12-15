export interface Candidate {
  id: number;
  name: string;
  party: string;
  image: string;
  votes: number;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  timestamp: string;
  gasUsed: number;
  candidateId: number;
}

export enum AppSection {
  HOME = 'HOME',
  THESIS = 'THESIS',
  VOTING_DEMO = 'VOTING_DEMO',
  AUDIT = 'AUDIT',
  REFERENCES = 'REFERENCES'
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  hasVoted: boolean;
  isMining: boolean;
}