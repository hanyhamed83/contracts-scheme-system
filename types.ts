
export enum SchemeStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IN_PROGRESS = 'In Progress'
}

export enum SchemePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum SchemeCategory {
  TECHNICAL = 'Technical',
  OPERATIONAL = 'Operational',
  FINANCIAL = 'Financial',
  STRATEGIC = 'Strategic',
  COMPLIANCE = 'Compliance'
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  status: SchemeStatus;
  priority: SchemePriority;
  category: SchemeCategory;
  createdBy: string;
  createdAt: string;
  budget?: number;
  aiInsight?: string;
  isAnalyzing?: boolean;
}

export interface AISchemeAnalysis {
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  suggestedPriority: SchemePriority;
}
