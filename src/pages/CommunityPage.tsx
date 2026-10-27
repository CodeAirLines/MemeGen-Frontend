import React, { useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import {
  CommunityHeader,
  CommunityPostCard,
  CommentsModal,
  PublishMemeModal,
} from '../features/community';
import { useCommunityStore } from '../stores/useCommunityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useProfileStore } from '../stores/useProfileStore';
import { useTemplateStore } from '../stores/useTemplateStore';
import type { PostAuthor, CommunityPost } from '../types/community';

export interface CommunityPageProps {
  onNavigate?: (route: string) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  const posts = useCommunityStore((state) => state.posts);
  const filters = useCommunityStore((state) => state.filters);
  const isLoading = useCommunityStore((state) => state.isLoading);
  const error = useCommunityStore((state) => state.error);
  const selectedPostForComments = useCommunityStore(
    (state) => state.selectedPostForComments
  );
  const isPublishModalOpen = useCommunityStore((state) => state.isPublishModalOpen);

  const fetchPosts = useCommunityStore((state) => state.fetchPosts);
  const setCategory = useCommunityStore((state) => state.setCategory);
  const setSearchQuery = useCommunityStore((state) => state.setSearchQuery);
  const setSortBy = useCommunityStore((state) => state.setSortBy);
  const toggleLikePost = useCommunityStore((state) => state.toggleLikePost);
  const submitComment = useCommunityStore((state) => state.submitComment);
  const publishPost = useCommunityStore((state) => state.publishPost);
  const openCommentsModal = useCommunityStore((state) => state.openCommentsModal);
  const closeCommentsModal = useCommunityStore((state) => state.closeCommentsModal);
  const openPublishModal = useCommunityStore((state) => state.openPublishModal);
  const closePublishModal = useCommunityStore((state) => state.closePublishModal);

  const authUser = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const setNotification = useTemplateStore((state) => state.setNotification);

  // Initial fetch on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Derive current author for likes, comments, and publishing
  const currentAuthor: PostAuthor = useMemo(() => {
    return {
      id: authUser?.id || 'local-creator',
      name: profile?.displayName || authUser?.fullName || 'Community Creator',
      handle: profile?.username
        ? `@${profile.username}`
        : authUser
        ? `@${authUser.email.split('@')[0]}`
        : '@creator',
      avatarUrl: profile?.avatarUrl || authUser?.avatarUrl || '/Profille/no-dp_16.webp',
      isVerified: Boolean(authUser),
    };
  }, [authUser, profile]);

  const handleLike = useCallback(
    async (postId: string) => {
      const isLiked = await toggleLikePost(postId, currentAuthor.id);
      if (isLiked) {
        setNotification({
          type: 'success',
          message: 'Post liked! (stored locally)',
        });
      }
    },
    [toggleLikePost, currentAuthor.id, setNotification]
  );

  const handlePublishSubmit = useCallback(
    async (payload: Parameters<typeof publishPost>[0], author: PostAuthor) => {
      await publishPost(payload, author);
      setNotification({
        type: 'success',
        message: 'Your meme was published to the Community Feed!',
      });
    },
    [publishPost, setNotification]
  );

  const handleRemix = useCallback(
    (post: CommunityPost) => {
      if (onNavigate) {
        onNavigate('/editor');
        setNotification({
          type: 'info',
          message: `Opened editor to remix "${post.title}"`,
        });
      }
    },
    [onNavigate, setNotification]
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/60 pt-20 sm:pt-28 pb-20">
      <Container size="lg">
        <div className="space-y-8">
          {/* Header & Controls */}
          <CommunityHeader
            category={filters.category}
            onSelectCategory={setCategory}
            searchQuery={filters.searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={filters.sortBy}
            onSortChange={setSortBy}
            onOpenPublish={openPublishModal}
            totalPosts={posts.length}
          />

          {/* Feed Content Area */}
          {error ? (
            <ErrorState
              title="Unable to load community posts"
              message={error}
              onRetry={fetchPosts}
            />
          ) : isLoading && posts.length === 0 ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-24 h-3.5 bg-slate-200 rounded-md" />
                      <div className="w-16 h-2.5 bg-slate-100 rounded-md" />
                    </div>
                  </div>
                  <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                  <div className="space-y-2">
                    <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
                    <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <EmptyState
              icon={<Search className="w-10 h-10 text-slate-400" />}
              title="No memes found"
              description={
                filters.searchQuery
                  ? `No community memes matched "${filters.searchQuery}". Try a different keyword or reset filters.`
                  : 'No memes found in this category yet. Be the first to publish one!'
              }
              action={
                <div className="flex items-center gap-3">
                  {filters.searchQuery || filters.category !== 'All' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCategory('All');
                        setSearchQuery('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  ) : null}
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={openPublishModal}
                  >
                    Share a Meme
                  </Button>
                </div>
              }
            />
          ) : (
            /* Responsive Community Posts Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentAuthor.id}
                  onLike={handleLike}
                  onOpenComments={openCommentsModal}
                  onRemix={handleRemix}
                />
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Comments Thread Modal */}
      <CommentsModal
        isOpen={Boolean(selectedPostForComments)}
        onClose={closeCommentsModal}
        post={selectedPostForComments}
        currentAuthor={currentAuthor}
        currentUserId={currentAuthor.id}
        onSubmitComment={submitComment}
        onLike={handleLike}
      />

      {/* Publish Meme Modal */}
      <PublishMemeModal
        isOpen={isPublishModalOpen}
        onClose={closePublishModal}
        onPublish={handlePublishSubmit}
        currentAuthor={currentAuthor}
      />
    </div>
  );
};

export default CommunityPage;
