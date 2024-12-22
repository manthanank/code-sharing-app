export interface Snippets {
  currentPage: number;
  totalPages: number;
  snippets: Snippet[];
}

export interface Snippet {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
