import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { profileStorage, DEFAULT_AVATAR_URL } from '../services/profileStorage';
import { useProfileStore } from '../stores/useProfileStore';
import { useAuthStore } from '../stores/useAuthStore';
import { ProfileHeader } from '../features/profile/ProfileHeader';
import { EditProfileModal } from '../features/profile/EditProfileModal';
import type { AuthUser } from '../types/auth';

const mockUser: AuthUser = {
  id: 'user-test-123',
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  avatarUrl: '/Profille/no-dp_16.webp',
  role: 'creator',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('Profile Service & Storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProfileStore.getState().clearProfile();
    useAuthStore.setState({
      user: mockUser,
      token: 'fake-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('retrieves default profile for user with sensible fallback avatar', async () => {
    const profile = await profileStorage.getProfile(mockUser);
    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe('Ada Lovelace');
    expect(profile?.username).toBe('ada');
    expect(profile?.email).toBe('ada@example.com');
    expect(profile?.avatarUrl).toBe(DEFAULT_AVATAR_URL);
  });

  it('updates and persists profile fields in localStorage', async () => {
    const updated = await profileStorage.updateProfile(
      {
        displayName: 'Lady Ada',
        username: 'adalove',
        bio: 'First computer programmer and visual humor architect.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        location: 'London, UK',
        website: 'https://memegen.io/@adalove',
      },
      mockUser
    );

    expect(updated.displayName).toBe('Lady Ada');
    expect(updated.username).toBe('adalove');
    expect(updated.bio).toBe('First computer programmer and visual humor architect.');
    expect(updated.location).toBe('London, UK');

    // Retrieve again from storage to verify persistent reload
    const reloaded = await profileStorage.getProfile(mockUser);
    expect(reloaded?.displayName).toBe('Lady Ada');
    expect(reloaded?.username).toBe('adalove');
    expect(reloaded?.avatarUrl).toBe('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
  });

  it('synchronizes update through useProfileStore and useAuthStore', async () => {
    await useProfileStore.getState().initProfileForUser(mockUser);
    await useProfileStore.getState().updateProfile({
      displayName: 'Ada Augusta',
      username: 'ada_augusta',
      bio: 'Remixing mathematics into memes.',
      avatarUrl: DEFAULT_AVATAR_URL,
    });

    const currentProfile = useProfileStore.getState().profile;
    expect(currentProfile?.displayName).toBe('Ada Augusta');

    const authUser = useAuthStore.getState().user;
    expect(authUser?.fullName).toBe('Ada Augusta');
  });
});

describe('ProfileHeader Component', () => {
  const sampleProfile = {
    id: 'user-test-123',
    displayName: 'Grace Hopper',
    username: 'ghopper',
    email: 'hopper@navy.mil',
    bio: 'Finding bugs since 1947.',
    avatarUrl: '/broken-image-link.jpg',
    role: 'creator' as const,
    joinedDate: 'September 2024',
    location: 'Arlington, VA',
  };

  it('renders creator profile details and handles broken avatar with fallback', () => {
    render(
      <ProfileHeader
        profile={sampleProfile}
        draftsCount={5}
        onEditClick={vi.fn()}
      />
    );

    expect(screen.getByText('@ghopper')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
    expect(screen.getByText('Finding bugs since 1947.')).toBeInTheDocument();
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);

    const avatarImg = screen.getByRole('img', { name: /Grace Hopper's avatar/i });
    expect(avatarImg).toHaveAttribute('src', '/broken-image-link.jpg');

    // Trigger broken image load
    fireEvent.error(avatarImg);

    // Image source should immediately switch to fallback
    expect(avatarImg).toHaveAttribute('src', '/Profille/no-dp_16.webp');
  });

  it('triggers onEditClick callback when Edit Profile button is clicked', () => {
    const onEdit = vi.fn();
    render(
      <ProfileHeader
        profile={sampleProfile}
        draftsCount={3}
        onEditClick={onEdit}
      />
    );

    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});

describe('EditProfileModal Validation', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: mockUser,
      token: 'fake-token',
      isAuthenticated: true,
      isLoading: false,
    });
    useProfileStore.setState({
      profile: {
        id: mockUser.id,
        displayName: 'Test User',
        username: 'testuser',
        email: mockUser.email,
        bio: 'Hello world',
        avatarUrl: DEFAULT_AVATAR_URL,
        role: 'creator',
        joinedDate: 'Recent',
      },
      isEditModalOpen: true,
      isSaving: false,
      error: null,
    });
  });

  it('rejects empty display name and shows clear validation message', async () => {
    render(<EditProfileModal />);

    const nameInput = screen.getByLabelText(/Display Name \*/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /Save Profile/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Display name is required.')).toBeInTheDocument();
    });
  });

  it('rejects invalid username with symbols', async () => {
    render(<EditProfileModal />);

    const usernameInput = screen.getByLabelText(/Username \*/i);
    fireEvent.change(usernameInput, { target: { value: 'invalid user!' } });

    const submitBtn = screen.getByRole('button', { name: /Save Profile/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Username can only contain letters, numbers, and underscores.')
      ).toBeInTheDocument();
    });
  });

  it('closes modal when Cancel is clicked', () => {
    render(<EditProfileModal />);
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(useProfileStore.getState().isEditModalOpen).toBe(false);
  });
});
