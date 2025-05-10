// types/TransactionTypes.ts
export enum TransactionType {
  Normal = "normal",
  Escrow = "escrow"
}

export interface Transaction {
  id: string;
  type: TransactionType.Normal;
  sender: string;
  receiver: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
}

export interface EscrowTransaction {
  id: string;
  type: TransactionType.Escrow;
  sender: string;
  receiver: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
  escrowId: string;
  status: "pending" | "completed" | "canceled";
  releaseDate: number;
  conditions: string;
  // Add these properties for the contract
  buyerApproved: boolean;
  sellerApproved: boolean;
}