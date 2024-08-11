import { create } from 'zustand';
import { User } from '../../types/types';

interface UserState {
    userId: number | null;
    user: User | null;
    token: string | null;
    setUser: (token: string, userId: number) => void;
    getUser: (user: User, userId: number) => void;
    clearUser: () => void;
}

// Create the Zustand store
const useUserStore = create<UserState>((set) => ({
    userId: null,
    user: null,
    token: null,
    setUser: (token, userId) => set({ token, userId }),
    getUser: (user, userId) => set({ user, userId }),
    clearUser: () => set({ user: null, token: null }),
}));


export default useUserStore;
