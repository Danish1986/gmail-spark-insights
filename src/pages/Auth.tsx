import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    // If user lands on /auth, redirect back to landing
    // Google OAuth will handle the redirect
    navigate("/");
  }, [navigate]);

  return null;
};

export default Auth;
