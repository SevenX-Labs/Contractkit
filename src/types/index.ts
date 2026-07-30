export type DocumentType = "invoice" | "agreement" | "nda" | "quotation" | "certificate" | "receipt";

export type DocumentStatus = "draft" | "sent" | "paid" | "signed" | "pending";

export type PaymentMethod = "UPI" | "Bank Transfer" | "PayPal";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface QuotationItem {
  id: string;
  srNo?: string;
  description: string;
  miniDescription?: string;
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
  projectName?: string;
  invoiceType?: string;
  miniDescription?: string;
  
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

export interface QuotationData {
  id?: string;
  quotationNumber: string;
  quotationDate: string;
  validityDays: number;
  validUntilDate: string;

  projectName: string;
  preparedBy: string;
  currency: string;
  paymentTerms: string;
  deliveryTime: string;

  senderName: string;
  senderCompany: string;
  senderAddress: string;
  senderEmail: string;
  senderPhone: string;
  senderWebsite: string;

  clientName: string;
  clientCompany?: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  clientWebsite?: string;
  clientGstin?: string;

  items: QuotationItem[];
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;

  termsAndConditions: string[];
  signatoryName: string;
  designation: string;
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
  version?: string;
  projectContext?: string;
  
  // Disclosing Party Details
  disclosingName?: string;
  disclosingCompany?: string;
  disclosingAddress?: string;
  disclosingEmail?: string;
  disclosingPhone?: string;
  disclosingWebsite?: string;
  
  // Receiving Party Details
  receivingName?: string;
  receivingCompany?: string;
  receivingAddress?: string;
  receivingEmail?: string;
  receivingPhone?: string;
  receivingWebsite?: string;
  
  // Legacy / Alternate party naming fallback
  freelancerName?: string;
  freelancerCompany?: string;
  clientName?: string;
  clientCompany?: string;
  
  // 18-Section Clauses
  purpose?: string;
  confidentialItems?: string;
  obligations?: string;
  exclusions?: string;
  permittedDisclosure?: string;
  termDuration?: string;
  returnTerm?: string;
  ipClause?: string;
  dataProtection?: string;
  limitationOfLiability?: string;
  breachRemedies?: string;
  terminationClause?: string;
  entireAgreement?: string;
  additionalTerms?: string;
  
  // Signatures
  disclosingSignatory?: string;
  disclosingDesignation?: string;
  receivingSignatory?: string;
  receivingDesignation?: string;
  
  status?: DocumentStatus;
  createdAt?: string;
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
  data: InvoiceData | QuotationData | AgreementData | NDAData | any;
}

