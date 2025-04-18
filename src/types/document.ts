
export interface Document {
  id: string;
  title: string;
  reference_number: string;
  document_date: string;
  document_type: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_categories: {
    name: string;
    description: string;
  };
  category_id: string;
}
