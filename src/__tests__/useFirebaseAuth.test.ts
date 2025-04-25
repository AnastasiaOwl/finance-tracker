import { renderHook, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import useFirebaseAuth from '../hooks/useFirebaseAuth';

jest.mock('@/firebase/firebaseConfig', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

describe('useFirebaseAuth hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets user and loading=false when auth state arrives', async () => {
    const fakeUser = { uid: 'u1', email: 'test@example.com' };

    (onAuthStateChanged as jest.Mock).mockImplementation((_, cb) => {
      cb(fakeUser);
      return () => {};
    });

    const { result } = renderHook(() => useFirebaseAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(fakeUser);
    });
  });

  it('calls the unsubscribe function on unmount', () => {
    const unsubscribe = jest.fn();
    (onAuthStateChanged as jest.Mock).mockImplementation(() => unsubscribe);

    const { unmount } = renderHook(() => useFirebaseAuth());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('sets loading=false even when user is null', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_, cb) => {
      cb(null);
      return () => {};
    });

    const { result } = renderHook(() => useFirebaseAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
