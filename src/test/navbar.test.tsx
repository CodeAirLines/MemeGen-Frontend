import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from '../components/layout/Header';
import { useAuthStore } from '../stores/useAuthStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { useTemplateStore } from '../stores/useTemplateStore';

describe('Header & Navbar Functional QA', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isDemoMode: false,
    });
    useTemplateStore.setState({
      searchQuery: '',
      selectedTemplate: null,
    });
    // Reset notification store to initial state
    useNotificationStore.setState({
      isNotificationsOpen: false,
      unreadCount: 2,
    });
  });

  it('renders logo and navigates to home when clicked', () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    const logo = screen.getByLabelText('MemeHub Home');
    expect(logo).toBeInTheDocument();
    fireEvent.click(logo);
    expect(onNavigate).toHaveBeenCalledWith('#home');
  });

  it('navigates to the correct routes for all main nav links', () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    // Create -> /editor
    const createLink = screen.getByRole('link', { name: 'Create' });
    fireEvent.click(createLink);
    expect(onNavigate).toHaveBeenCalledWith('/editor');

    // GIF Maker -> /gif-maker
    const gifMakerLink = screen.getByRole('link', { name: 'GIF Maker' });
    fireEvent.click(gifMakerLink);
    expect(onNavigate).toHaveBeenCalledWith('/gif-maker');

    // Community -> #community (which router maps to /community)
    const communityLink = screen.getByRole('link', { name: 'Community' });
    fireEvent.click(communityLink);
    expect(onNavigate).toHaveBeenCalledWith('#community');

    // Templates -> #templates
    const templatesLink = screen.getByRole('link', { name: 'Templates' });
    fireEvent.click(templatesLink);
    expect(onNavigate).toHaveBeenCalledWith('#templates');

    // AI Tools -> #ai-tools
    const aiToolsLink = screen.getByRole('link', { name: 'AI Tools' });
    fireEvent.click(aiToolsLink);
    expect(onNavigate).toHaveBeenCalledWith('#ai-tools');
  });

  it('opens and manages the Notifications popover panel', async () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    // Check notification bell exists
    const bellBtn = screen.getByLabelText(/View notifications/i);
    expect(bellBtn).toBeInTheDocument();

    // Click to open notification dropdown
    fireEvent.click(bellBtn);
    expect(await screen.findByText('Notifications')).toBeInTheDocument();
    expect(await screen.findByText(/Shin-chan Meme is Trending/i)).toBeInTheDocument();

    // Click "Read all"
    const readAllBtn = await screen.findByTitle('Mark all notifications as read');
    fireEvent.click(readAllBtn);
    expect(useNotificationStore.getState().unreadCount).toBe(0);

    // Click on a notification item to navigate
    const notifItem = await screen.findByText(/Shin-chan Meme is Trending/i);
    fireEvent.click(notifItem);
    expect(onNavigate).toHaveBeenCalledWith('/editor');
  });

  it('clears all notifications and displays the empty state', async () => {
    render(<Header />);
    const bellBtn = screen.getByLabelText(/View notifications/i);
    fireEvent.click(bellBtn);

    const clearBtn = await screen.findByTitle('Clear all notifications');
    fireEvent.click(clearBtn);

    expect(await screen.findByText(/You're all caught up!/i)).toBeInTheDocument();
    expect(useNotificationStore.getState().notifications.length).toBe(0);
  });

  it('displays live search results when typing in navbar search', async () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    const searchInput = screen.getByRole('searchbox', { name: 'Search memes and templates' });
    fireEvent.change(searchInput, { target: { value: 'Drake' } });
    fireEvent.focus(searchInput);

    // Dropdown should appear with template suggestions
    expect(await screen.findByRole('listbox', { name: 'Search suggestions' })).toBeInTheDocument();
    expect(await screen.findByText(/Templates matching “Drake”/i)).toBeInTheDocument();

    // Select the template from results
    const option = await screen.findByRole('option');
    fireEvent.click(option);

    expect(onNavigate).toHaveBeenCalledWith('/editor');
    expect(useTemplateStore.getState().selectedTemplate?.name).toBe('Drake Hotline Bling');
  });

  it('renders profile dropdown with working links when authenticated', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      },
    });

    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    const profileMenuBtn = screen.getByLabelText('User profile menu');
    expect(profileMenuBtn).toBeInTheDocument();

    // Open dropdown
    await act(async () => {
      fireEvent.click(profileMenuBtn);
    });
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('@jane')).toBeInTheDocument();

    // Click "My Profile"
    const profileLink = screen.getByRole('button', { name: /My Profile/i });
    fireEvent.click(profileLink);
    expect(onNavigate).toHaveBeenCalledWith('/profile');

    // Open again and click "My Saved Drafts"
    await act(async () => {
      fireEvent.click(profileMenuBtn);
    });
    const draftsLink = screen.getByRole('button', { name: /My Saved Drafts/i });
    fireEvent.click(draftsLink);
    expect(onNavigate).toHaveBeenCalledWith('/drafts');

    // Open again and click "Create New Meme"
    await act(async () => {
      fireEvent.click(profileMenuBtn);
    });
    const createNewLink = screen.getByRole('button', { name: /Create New Meme/i });
    fireEvent.click(createNewLink);
    expect(onNavigate).toHaveBeenCalledWith('/editor');
  });

  it('logs out and redirects to home from profile dropdown', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      },
    });

    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    const profileMenuBtn = screen.getByLabelText('User profile menu');
    fireEvent.click(profileMenuBtn);

    const logoutBtn = screen.getByRole('button', { name: /Log Out/i });
    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(onNavigate).toHaveBeenCalledWith('/');
  });

  it('opens and closes mobile menu drawer properly', () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);

    const hamburger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(hamburger);

    const drawer = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(drawer).toBeInTheDocument();

    // Close button inside drawer
    const closeBtn = screen.getByLabelText('Close menu');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
