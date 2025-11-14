export interface DocumentResponse {
  success: boolean;
  message?: string;
  data?: Document[];
}

export interface Document {
  id: string;
  document: string;
  interpreter_id: string;
}

export type ExistingDocument = {
  id: string;
  name: string;
  url: string;
};
