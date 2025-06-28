'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, []);

    return {
        user,
        isLoggedIn: !!user,
    };
}
