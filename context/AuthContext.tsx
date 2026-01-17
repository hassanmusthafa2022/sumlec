"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/db";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [signingIn, setSigningIn] = useState(false); // Prevent multiple popups

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        // Prevent multiple popup requests
        if (signingIn) {
            console.log("Login already in progress...");
            return;
        }

        setSigningIn(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Create user profile in Firestore if it doesn't exist
            await createUserProfile(result.user);
        } catch (error: any) {
            // Ignore common popup errors (user cancelled, closed popup, etc.)
            if (
                error.code === 'auth/cancelled-popup-request' ||
                error.code === 'auth/popup-closed-by-user' ||
                error.code === 'auth/popup-blocked'
            ) {
                console.log("Popup cancelled or closed by user.");
            } else {
                console.error("Error signing in with Google", error);
            }
        } finally {
            setSigningIn(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
