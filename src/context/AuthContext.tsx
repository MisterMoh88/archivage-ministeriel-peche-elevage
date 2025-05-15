
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  full_name: string | null;
  role: 'admin' | 'archiviste' | 'utilisateur';
  department: string | null;
  status: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      } 
      
      if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  useEffect(() => {
    console.log("Initializing auth state");

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      
      // First update session and user synchronously
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Then fetch the profile asynchronously if needed
      if (newSession?.user) {
        // Use setTimeout to avoid potential recursive issues
        setTimeout(() => {
          fetchUserProfile(newSession.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }

      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        toast.success('Connexion réussie');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Vous avez été déconnecté');
        navigate('/login');
      }
      
      setIsLoading(false);
    });

    // Check for existing session on load
    const checkSession = async () => {
      try {
        console.log("Checking existing session");
        setIsLoading(true);
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          return;
        }
        
        console.log("Session check result:", currentSession ? "Session active" : "No active session");
        
        // Update state with session information
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user profile if needed
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      setIsLoading(true);
      
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        console.error("Sign in error:", response.error.message);
        throw response.error;
      } 
      
      console.log("Sign in successful", response.data);
      return response;
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting sign out");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast.error(error.message);
      } else {
        console.log("Sign out successful");
      }
    } catch (error: any) {
      console.error("Unexpected sign out error:", error);
      toast.error(error.message || "Une erreur est survenue lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    session,
    isLoading,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
};
