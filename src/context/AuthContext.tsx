
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
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
  signIn: (email: string, password: string) => Promise<void>;
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
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  useEffect(() => {
    console.log("Initializing auth state");

    // Configurer l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        // Utiliser setTimeout pour éviter les problèmes de boucle infinie
        setTimeout(() => {
          fetchUserProfile(newSession.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }

      if (event === 'SIGNED_IN') {
        toast.success('Connexion réussie');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Vous avez été déconnecté');
        navigate('/login');
      }
      
      setIsLoading(false);
    });

    // Vérifier la session existante
    const checkSession = async () => {
      try {
        console.log("Checking existing session");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          toast.error("Erreur de récupération de session: " + error.message);
        } else {
          console.log("Session check result:", currentSession ? "Session active" : "No active session");
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id);
          }
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
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message);
      } else {
        console.log("Sign in successful");
      }
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      toast.error(error.message || "Une erreur est survenue lors de la connexion");
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
