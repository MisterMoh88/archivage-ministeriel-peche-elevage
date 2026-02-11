
export interface Document {
  id: string;
  title: string;
  reference_number: string;
  document_date: string;
  document_type: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_categories?: {
    name: string;
    description: string;
  };
  category_id: string;
  description?: string;
  issuing_department?: string;
  budget_year?: string;
  budget_program?: string;
  market_type?: "DC" | "DRPR" | "DRPO" | "AAO";
  confidentiality_level: "C0" | "C1" | "C2" | "C3";
  upload_date: string;
  uploaded_by: string;
  last_modified?: string;
  modified_by?: string;
  status?: "actif" | "archivé";
}

export interface DocumentHistory {
  id: string;
  document_id: string;
  user_id: string;
  action_type: "upload" | "update" | "delete" | "view";
  performed_at: string;
  details?: {
    notes?: string;
    changes?: {
      before: Partial<Document>;
      after: Partial<Document>;
    };
  } | string;
  user_fullname?: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'admin_local' | 'archiviste' | 'utilisateur';
  department: string | null;
  status: string;
}
