import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string;
  terms_accepted: boolean;
  email_consent: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    const startTime = Date.now();
    try {
      // Add 5-second timeout for profile fetch
      const profilePromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const result = await Promise.race([
        profilePromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
        )
      ]) as Awaited<typeof profilePromise>;

      const { data, error } = result;
      
      if (error) throw error;
      setProfile(data);
      console.log("✅ Profile fetched in", Date.now() - startTime, "ms");
    } catch (error) {
      console.error("❌ Profile fetch error:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session with timeout
    const checkSession = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const result = await Promise.race([
          sessionPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Session check timeout")), 8000)
          )
        ]) as Awaited<typeof sessionPromise>;

        const { data: { session } } = result;
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Session check error:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
