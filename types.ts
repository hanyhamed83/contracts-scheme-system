
export enum SchemeStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface Scheme {
  // Database fields
  contractorRemarks?: string;
  Rcvd_Date?: string;
  Sch_Ref?: string;
  Job_no: string;
  APPNUMBER?: string;
  BLK?: string;
  SUPERVISOR?: string;
  Contractor_Name?: string;
  Title1: string;
  STATUS: string;
  DATE_OF_COMPLETED?: string;
  NUMBEROFSS?: string;
  APPSTATUS?: string;
  REMARKS?: string;
  DATEOFMEASUREMENT?: string;
  CONTRACTORAPPRAISAL?: string;
  AREA?: string;
  TYPE?: string;
  labCost?: string;
  matCost?: string;
  PO_NUMBER?: string;
  UserID?: string;
  IO?: string;
  IUWR_NUMBER?: string;
  totalCost?: string;
  
  // UI helper fields
  id: string; // Used as alias for Job_no or unique identifier
  aiInsight?: string;
  isAnalyzing?: boolean;
}

export interface AISchemeAnalysis {
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  suggestedStatus: string;
}
