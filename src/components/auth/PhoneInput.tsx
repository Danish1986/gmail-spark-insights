import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhoneInputProps {
  onSuccess: (email: string, password: string) => Promise<void>;
}

export const PhoneInput = ({ onSuccess }: PhoneInputProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!termsAccepted && isSignUp) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;
        toast.success("Account created! Signing you in...");
        await onSuccess(email, password);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Signed in successfully!");
        await onSuccess(email, password);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isSignUp ? "sign up" : "sign in"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignUp ? "Get started with smart money management" : "Sign in to continue"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email && password.length >= 6) {
                handleSubmit();
              }
            }}
          />
        </div>

        {isSignUp && (
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
            >
              I agree to Growi's{" "}
              <span className="text-primary underline">Terms & Conditions</span> and{" "}
              <span className="text-primary underline">Privacy Policy</span>
            </label>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!email || password.length < 6 || (isSignUp && !termsAccepted) || loading}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Sign Up" : "Sign In")}
        </Button>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};
