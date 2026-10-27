export type CommunityCategory =
  | 'All'
  | 'Trending'
  | 'Tech/Dev'
  | 'Anime'
  | 'Gaming'
  | 'Animals'
  | 'Reactions'
  | 'Classics';

export type CommunitySortOption = 'trending' | 'latest' | 'most-liked';

export interface PostAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  category: string;
  author: PostAuthor;
  likesCount: number;
  likedBy: string[]; // User IDs who liked the post to prevent duplicate likes
  commentsCount: number;
  comments: PostComment[];
  createdAt: string;
  tags: string[];
  isLocalUserPost?: boolean;
}

export interface PublishMemePayload {
  title: string;
  category: string;
  imageUrl: string;
  tags?: string[];
}

export interface CommunityFilterState {
  category: string;
  searchQuery: string;
  sortBy: CommunitySortOption;
}
