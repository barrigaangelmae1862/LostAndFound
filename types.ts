export type PostType = "lost" | "found";

export interface Post {
  id?: string;
  title: string;
  description: string;
  type?: PostType;
  imageUrl?: string | null;
  status: "pending" | "approved" | "rejected";
  userId: string;
  createdAt?: any;
}