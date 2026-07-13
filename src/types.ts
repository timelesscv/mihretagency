export type Language = "en" | "am" | "ar";

export interface PartnerRequest {
  id: string;
  employerName: string;
  country: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  requiredRole: "Housemaids" | "Cleaners" | "Cooks" | "Nannies" | "Caregivers";
  quantity: number;
  monthlySalary: string;
  notes: string;
  submittedAt: string;
  status: "Pending Vetting" | "Verified" | "Staff Matched" | "Completed";
}

export interface WorkerApplication {
  id: string;
  fullName: string;
  gender: "Female" | "Male";
  age: number;
  phone: string;
  preferredDestination: "Saudi Arabia" | "Kuwait" | "Jordan" | "Any";
  role: "Housemaids" | "Cleaners" | "Cooks" | "Nannies" | "Caregivers";
  hasPassport: "Yes" | "No" | "In Progress";
  passportNumber: string;
  experience: string;
  languages: string[];
  status: "Applied" | "Document Approved" | "Scheduled Interview" | "Employer Matched" | "Visa Processing" | "Ready for Departure";
  submittedAt: string;
}
