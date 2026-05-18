// This file creates a "global state" for authentication.
// Any page or component in your app can read the current user from here.
// Firebase tracks who is logged in, but we need a way to share that

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./firebase";


interface AuthContextType {
  user: User | null;        
  loading: boolean;         
  signOut: () => Promise<void>; 
}

//Create the context

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      setLoading(false);    
    });

    return () => unsubscribe();
  }, []);


  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

//Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}