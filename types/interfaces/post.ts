
import { PostType } from "@/app/generated/prisma";


export interface Post {
  id: string;
  title: string;
  description: string;
  type: PostType;
  category: string;
  location: string | null;
  requirements: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
  views: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}


export interface PostWithAuthor extends Post {
  author: {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
  };
}

// Interface pour créer un Post
export interface CreatePostInput {
  title: string;
  description: string;
  type: PostType;
  category: string;
  location?: string;
  requirements?: string;
  contactEmail?: string;
  contactPhone?: string;
  expiresAt?: Date;
}

// Interface pour mettre à jour un Post
export interface UpdatePostInput {
  title?: string;
  description?: string;
  type?: PostType;
  category?: string;
  location?: string;
  requirements?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
  expiresAt?: Date;
}

// Interface pour les filtres de recherche
export interface PostFilters {
  type?: PostType;
  category?: string;
  location?: string;
  search?: string;
  isActive?: boolean;
  authorId?: string;
}

// Interface pour la pagination
export interface PostsResponse {
  posts: PostWithAuthor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
