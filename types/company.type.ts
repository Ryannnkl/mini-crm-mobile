export type Company = {
  id: string;
  name: string;
  status: CompanyStatus;
  website?: string;
  phone?: string;
  potentialValue?: number;
  leadSource?: string;
};

export type CompanyStatus = 'lead' | 'negotiating' | 'won' | 'lost';

export const companyStatusColumns = [
  { id: "lead", name: "Lead", color: "#848484" },
  { id: "negotiating", name: "Negotiating", color: "#f59e0b" },
  { id: "won", name: "Won", color: "#10b981" },
  { id: "lost", name: "Lost", color: "#ef4444" },
];