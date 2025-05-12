
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCUbw9Xnqdbc1PfTUjASRRJZfX_H60iyU8",
  authDomain: "mini-crm-1c689.firebaseapp.com",
  projectId: "mini-crm-1c689",
  storageBucket: "mini-crm-1c689.firebasestorage.app",
  messagingSenderId: "180514214165",
  appId: "1:180514214165:web:0d9cc90e299e143430991c"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName) + "&background=4F46E5&color=fff"
        };
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  // Sign in with Google OAuth (real)
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get user data from result
      const user = result.user;
      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName) + "&background=4F46E5&color=fff"
      };
      
      setCurrentUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name}!`,
      });
      
      return userData;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      
      toast({
        title: "Logout failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
