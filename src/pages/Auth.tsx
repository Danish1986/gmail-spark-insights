import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingWizard } from "@/components/auth/OnboardingWizard";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    // Only redirect if user is authenticated AND profile is complete
    if (user && profile?.full_name) {
      navigate("/dashboard");
    }
  }, [user, profile, navigate]);

  // Check if we should start at profile step (incomplete profile)
  const initialStep = location.state?.profileIncomplete ? "profile" : "phone";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <OnboardingWizard initialStep={initialStep} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
