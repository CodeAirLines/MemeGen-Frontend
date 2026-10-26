export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  role: 'creator' | 'pro' | 'admin';
  joinedDate: string; // e.g. "March 2024"
  location?: string;
  website?: string;
}

export interface ProfileStats {
  totalMemesCreated: number;
  savedDraftsCount: number;
  publishedMemesCount: number;
}

export interface ProfileUpdatePayload {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  location?: string;
  website?: string;
}
