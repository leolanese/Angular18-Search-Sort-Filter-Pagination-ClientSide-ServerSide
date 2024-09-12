export interface ApiResponse {
    items: ResponseItem[];
    total_count: number;
}
  
export interface ResponseItem {
  created_at: string;
  number: string;
  state: string;
  title: string;
}
