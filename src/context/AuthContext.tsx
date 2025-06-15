import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  full_name: string | null;
  role: 'admin' | 'admin_local' | 'archiviste' | 'utilisateur';
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

// Délai d'inactivité en millisecondes (10 minutes)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Références pour gérer le timer d'inactivité
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fonction pour déconnecter l'utilisateur pour inactivité
  const handleInactivityLogout = useCallback(async () => {
    console.log("Déconnexion automatique pour inactivité");
    toast.info("Vous avez été déconnecté pour inactivité");
    await signOut();
  }, []);

  // Fonction pour afficher un avertissement avant déconnexion
  const showInactivityWarning = useCallback(() => {
    toast.warning("Vous serez déconnecté dans 1 minute pour inactivité. Bougez la souris pour rester connecté.");
  }, []);

  // Fonction pour réinitialiser le timer d'inactivité
  const resetInactivityTimer = useCallback(() => {
    // Nettoyer les timers existants
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    // Ne démarrer le timer que si l'utilisateur est connecté
    if (user && session) {
      // Timer pour l'avertissement (9 minutes)
      warningTimerRef.current = setTimeout(() => {
        showInactivityWarning();
      }, INACTIVITY_TIMEOUT - 60000);

      // Timer pour la déconnexion (10 minutes)
      inactivityTimerRef.current = setTimeout(() => {
        handleInactivityLogout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [user, session, handleInactivityLogout, showInactivityWarning]);

  // Gestionnaire d'événements pour détecter l'activité
  const handleUserActivity = useCallback(() => {
    if (user && session) {
      resetInactivityTimer();
    }
  }, [user, session, resetInactivityTimer]);

  // Configuration des écouteurs d'événements pour détecter l'activité
  useEffect(() => {
    if (user && session) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      // Ajouter les écouteurs d'événements
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });

      // Démarrer le timer d'inactivité
      resetInactivityTimer();

      // Nettoyer les écouteurs lors du démontage
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
        
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
      };
    }
  }, [user, session, handleUserActivity, resetInactivityTimer]);

  useEffect(() => {
    console.log("Initializing auth state");
    setIsLoading(true);

    // Set up the auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      
      // Update session and user synchronously
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
        // Nettoyer les timers si l'utilisateur se déconnecte
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
      }

      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        toast.success('Connexion réussie');
        // Ne pas naviguer si nous sommes déjà sur la page d'accueil
        const currentPath = window.location.pathname;
        if (currentPath === '/login') {
          navigate('/', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        toast.info('Vous avez été déconnecté');
        navigate('/login', { replace: true });
      }
      
      setIsLoading(false);
    });

    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking existing session");
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          setIsLoading(false);
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

        // Gérer la navigation initiale
        if (isInitialLoad) {
          setIsInitialLoad(false);
          // Si un utilisateur est connecté et nous sommes sur la page de connexion, redirigez vers l'accueil
          if (currentSession && window.location.pathname === '/login') {
            navigate('/', { replace: true });
          }
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Execute session check
    checkSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, isInitialLoad]);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
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
      
      // Nettoyer les timers d'inactivité
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      
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

  const value: AuthContextType = {
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
