import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useAppRouter } from '../hooks/useAppRouter';
import { NotFoundPage } from '../pages/NotFoundPage';

describe('useAppRouter Navigation Hook', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('defaults to home route on root path', () => {
    const { result } = renderHook(() => useAppRouter());
    expect(result.current.route).toBe('home');
  });

  it('navigates to known routes correctly', () => {
    const { result } = renderHook(() => useAppRouter());

    act(() => {
      result.current.navigate('/editor');
    });
    expect(result.current.route).toBe('editor');
    expect(window.location.pathname).toBe('/editor');

    act(() => {
      result.current.navigate('/profile');
    });
    expect(result.current.route).toBe('profile');
    expect(window.location.pathname).toBe('/profile');

    act(() => {
      result.current.navigate('/drafts');
    });
    expect(result.current.route).toBe('drafts');
    expect(window.location.pathname).toBe('/drafts');
  });

  it('resolves GIF maker aliases (/gif-maker, /gif-generator, /gif) to gif-generator route', () => {
    const { result } = renderHook(() => useAppRouter());

    act(() => {
      result.current.navigate('/gif-maker');
    });
    expect(result.current.route).toBe('gif-generator');

    act(() => {
      result.current.navigate('/gif');
    });
    expect(result.current.route).toBe('gif-generator');

    act(() => {
      result.current.navigate('/gif-generator');
    });
    expect(result.current.route).toBe('gif-generator');
  });

  it('resolves Community aliases (/community, /explore) to community route', () => {
    const { result } = renderHook(() => useAppRouter());

    act(() => {
      result.current.navigate('/community');
    });
    expect(result.current.route).toBe('community');

    act(() => {
      result.current.navigate('/explore');
    });
    expect(result.current.route).toBe('community');
  });

  it('resolves /templates and /ai-tools paths to home route', () => {
    window.history.pushState({}, '', '/templates');
    const { result } = renderHook(() => useAppRouter());
    expect(result.current.route).toBe('home');

    act(() => {
      result.current.navigate('/ai-tools');
    });
    expect(result.current.route).toBe('home');
  });

  it('routes unknown paths like /unknown-route to not-found route', () => {
    window.history.pushState({}, '', '/unknown-route');
    const { result } = renderHook(() => useAppRouter());
    expect(result.current.route).toBe('not-found');

    act(() => {
      result.current.navigate('/not-a-real-page');
    });
    expect(result.current.route).toBe('not-found');
  });

  it('navigates to anchor links on home page', () => {
    window.history.pushState({}, '', '/community');
    const { result } = renderHook(() => useAppRouter());
    expect(result.current.route).toBe('community');

    act(() => {
      result.current.navigate('#templates');
    });
    expect(result.current.route).toBe('home');
    expect(window.location.hash).toBe('#templates');

    act(() => {
      result.current.navigate('/');
    });
    expect(result.current.route).toBe('home');
    expect(window.location.pathname).toBe('/');
  });
});

describe('NotFoundPage Component', () => {
  it('renders 404 message and navigation recovery options', () => {
    const onNavigate = vi.fn();
    render(<NotFoundPage onNavigate={onNavigate} />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('MEME NOT FOUND')).toBeInTheDocument();
    expect(screen.getByText(/Lost in the Meme Cosmos\?/i)).toBeInTheDocument();

    const homeBtn = screen.getByRole('button', { name: /Back to Home/i });
    fireEvent.click(homeBtn);
    expect(onNavigate).toHaveBeenCalledWith('/');

    const studioBtn = screen.getByRole('button', { name: /Open Meme Studio/i });
    fireEvent.click(studioBtn);
    expect(onNavigate).toHaveBeenCalledWith('/editor');
  });
});

