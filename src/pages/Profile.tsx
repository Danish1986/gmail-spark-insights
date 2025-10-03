import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, User, LogOut, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { profile, user, loading, signOut } = useAuth();

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return profile.email?.[0]?.toUpperCase() || "U";
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 4) return phone;
    return phone.slice(0, -4).replace(/\d/g, "•") + phone.slice(-4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto bg-primary/10 text-primary">
              <AvatarFallback className="text-2xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-3xl font-bold">
                {profile.full_name || "User"}
              </h1>
              <p className="text-muted-foreground">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            
            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{profile.email || user?.email}</p>
                {user?.email_confirmed_at && (
                  <div className="flex items-center gap-1 text-xs text-success mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{maskPhone(profile.phone)}</p>
                {user?.phone_confirmed_at && (
                  <div className="flex items-center gap-1 text-xs text-success mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Full Name */}
            {profile.full_name && (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{profile.full_name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Terms & Conditions</span>
                <span className="text-xs text-muted-foreground">
                  {profile.terms_accepted ? "Accepted" : "Not accepted"}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Email Integration</span>
                <span className="text-xs text-muted-foreground">
                  {profile.email_consent ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
