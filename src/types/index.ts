export type DocumentType = "invoice" | "agreement" | "nda";

export type DocumentStatus = "draft" | "sent" | "paid" | "signed" | "pending";

export type PaymentMethod = "UPI" | "Bank Transfer" | "PayPal";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface FreelancerProfile {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  upiId: string;
  bankAccount: string;
  bankIfsc: string;
  bankName: string;
  paypalEmail: string;
  invoicePrefix: string;
}

export interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  senderName: string;
  senderCompany: string;
  senderAddress: string;
  senderEmail: string;
  senderPhone: string;
  
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  
  paymentMethod: PaymentMethod;
  paymentDetails: string;
  
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  
  note: string;
  status: DocumentStatus;
  createdAt: string;
}

export interface AgreementData {
  id?: string;
  agreementNumber: string;
  date: string;
  
  freelancerName: string;
  freelancerCompany: string;
  freelancerEmail: string;
  
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  
  projectTitle: string;
  projectDescription: string;
  deliverables: string;
  
  startDate: string;
  deadline: string;
  
  totalAmount: number;
  advancePercentage: number;
  finalPercentage: number;
  revisionLimit: "1" | "2" | "3" | "Unlimited";
  
  ownershipClause: string;
  cancellationPolicy: string;
  additionalTerms: string;
  
  freelancerSignature: string;
  freelancerSignDate: string;
  clientSignature: string;
  clientSignDate: string;
  
  status: DocumentStatus;
  createdAt: string;
}

export interface NDAData {
  id?: string;
  ndaNumber: string;
  effectiveDate: string;
  
  freelancerName: string;
  freelancerCompany: string;
  
  clientName: string;
  clientCompany: string;
  
  projectContext: string;
  confidentialInfoDefinition: string;
  obligations: string;
  duration: "1 Year" | "2 Years" | "3 Years" | "5 Years";
  
  returnDestroyClause: string;
  breachPenalty: string;
  additionalNotes: string;
  
  freelancerSignature: string;
  freelancerSignDate: string;
  clientSignature: string;
  clientSignDate: string;
  
  status: DocumentStatus;
  createdAt: string;
}

export interface SavedDocument {
  id: string;
  title: string;
  documentNumber: string;
  type: DocumentType;
  clientName: string;
  amount?: number;
  date: string;
  status: DocumentStatus;
  updatedAt: string;
  data: InvoiceData | AgreementData | NDAData;
}
