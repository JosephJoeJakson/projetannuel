'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthLogic } from '../hooks/useAuth';

type AuthContextType = ReturnType<typeof useAuthLogic>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuthLogic();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 