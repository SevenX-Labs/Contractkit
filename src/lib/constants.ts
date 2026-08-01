import { FreelancerProfile, InvoiceData, AgreementData, NDAData } from "../types";

export const DEFAULT_PROFILE: FreelancerProfile = {
  name: "SevenX Labs",
  company: "SevenX Labs Studio",
  email: "hello@sevenxlabs.com",
  phone: "+91 98765 43210",
  address: "SevenX Labs Tech Park, HSR Layout, Sector 1, Bengaluru, Karnataka 560102",
  upiId: "sevenxlabs@upi",
  bankName: "HDFC Bank",
  bankAccount: "50100234567890",
  bankIfsc: "HDFC0001234",
  paypalEmail: "billing@sevenxlabs.com",
  invoicePrefix: "SXL-INV-",
};

export const DEFAULT_INVOICE_DATA: InvoiceData = {
  invoiceNumber: "SXL-INV-001",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  
  senderName: DEFAULT_PROFILE.name,
  senderCompany: DEFAULT_PROFILE.company,
  senderAddress: DEFAULT_PROFILE.address,
  senderEmail: DEFAULT_PROFILE.email,
  senderPhone: DEFAULT_PROFILE.phone,
  
  clientName: "Acme Dynamics Private Limited",
  clientCompany: "Acme Dynamics Pvt Ltd",
  clientAddress: "100 MG Road, Indiranagar, Bengaluru, KA 560038",
  clientEmail: "billing@acmedynamics.in",
  clientPhone: "+91 91234 56789",
  
  paymentMethod: "UPI",
  paymentDetails: `UPI ID: ${DEFAULT_PROFILE.upiId} | HDFC Acc: ${DEFAULT_PROFILE.bankAccount} (IFSC: ${DEFAULT_PROFILE.bankIfsc})`,
  
  items: [
    {
      id: "item-1",
      description: "Custom Full-Stack Next.js 16 Web Application",
      quantity: 1,
      rate: 250000,
      amount: 250000,
    },
    {
      id: "item-2",
      description: "UI/UX Design System & Mobile Responsive UI",
      quantity: 1,
      rate: 95000,
      amount: 95000,
    },
  ],
  
  subtotal: 345000,
  discountPercent: 0,
  discountAmount: 0,
  taxPercent: 0,
  taxAmount: 0,
  total: 345000,
  
  note: "This is not a GST invoice.",
  status: "sent",
  createdAt: new Date().toISOString(),
};

export const DEFAULT_AGREEMENT_DATA: AgreementData = {
  agreementNumber: "SXL-AGR-001",
  date: new Date().toISOString().split("T")[0],
  
  freelancerName: DEFAULT_PROFILE.name,
  freelancerCompany: DEFAULT_PROFILE.company,
  freelancerEmail: DEFAULT_PROFILE.email,
  
  clientName: "Vortex Innovations Pvt Ltd",
  clientCompany: "Vortex Innovations",
  clientEmail: "contracts@vortex.in",
  
  projectTitle: "SaaS Dashboard & Automation Platform Development",
  projectDescription: "Design and full-stack development of a modern customer management dashboard with real-time analytics, dynamic reporting, and payment gateway integration.",
  deliverables: "- Fully responsive Next.js 16 web application\n- Custom Tailwind CSS v4 design system\n- REST/GraphQL API integration\n- Deployment setup on Vercel & AWS",
  
  startDate: new Date().toISOString().split("T")[0],
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  
  totalAmount: 450000,
  advancePercentage: 50,
  finalPercentage: 50,
  revisionLimit: "3",
  
  ownershipClause: "Full intellectual property rights, source code, and design assets shall be transferred to the Client upon receipt of 100% full payment.",
  cancellationPolicy: "Either party may terminate this agreement with 7 days written notice. Payment shall be due for all work completed up to the date of cancellation.",
  additionalTerms: "All work is provided with a 30-day bug fix guarantee following final deployment.",
  
  warrantyPeriod: "30 Days Free Warranty",
  warrantyScope: "The warranty period covers bug fixes, security patches, and issues directly related to the deliverables.",
  
  freelancerSignature: DEFAULT_PROFILE.name,
  freelancerSignDate: new Date().toISOString().split("T")[0],
  clientSignature: "Rajesh Kumar, CTO",
  clientSignDate: new Date().toISOString().split("T")[0],
  
  status: "signed",
  createdAt: new Date().toISOString(),
};

export const DEFAULT_NDA_DATA: NDAData = {
  ndaNumber: "SXL-NDA-001",
  effectiveDate: new Date().toISOString().split("T")[0],
  
  freelancerName: DEFAULT_PROFILE.name,
  freelancerCompany: DEFAULT_PROFILE.company,
  
  clientName: "Nexus AI Tech India",
  clientCompany: "Nexus AI Tech",
  
  projectContext: "Exploratory discussion and development of proprietary AI algorithm workflows, trade secrets, software blueprints, and strategic roadmaps.",
  confidentialInfoDefinition: "Confidential Information includes without limitation all technical data, source code, product designs, customer lists, financial figures, proprietary algorithms, and business plans disclosed by either party.",
  obligations: "The Receiving Party agrees to hold all Confidential Information in strict confidence and shall not disclose, copy, or distribute it to third parties without prior written consent.",
  duration: "2 Years",
  
  returnDestroyClause: "Upon written request or termination of project discussions, all documents, prototypes, and electronic data containing Confidential Information must be returned or certified destroyed within 7 business days.",
  breachPenalty: "Any unauthorized disclosure or breach of confidentiality will entitle the Disclosing Party to seek immediate injunctive relief and monetary damages equal to actual proven financial loss.",
  additionalTerms: "Governed by the laws of India and jurisdiction of Bengaluru.",
  
  freelancerSignature: DEFAULT_PROFILE.name,
  freelancerSignDate: new Date().toISOString().split("T")[0],
  clientSignature: "Priya Sharma, CEO",
  clientSignDate: new Date().toISOString().split("T")[0],
  
  status: "signed",
  createdAt: new Date().toISOString(),
};
