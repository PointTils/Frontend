export interface DocumentResponse {
  success: boolean;
  message: string;
  data: [
    {
      id: string;
      document: string;
      interpreter_id: string;
    },
  ];
}
