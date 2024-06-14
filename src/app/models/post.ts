export interface Post {
  title: string;
  link: string;
  details: string;
  category: {
    categoryId: string;
    category: string;
  };
  imageUrl: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  createdAt: Date;
}
