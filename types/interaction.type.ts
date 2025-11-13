export interface Interaction {
  id: number | string;
  content: string;
  companyId: number;
  createdAt: string;
  type?: string;
  userId?: string;
  updatedAt?: string;
}