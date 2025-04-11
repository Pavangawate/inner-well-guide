
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Pencil, Save, User, Mail, CalendarClock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: user?.email || "",
    createdAt: user?.created_at || "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();
        
      if (error) {
        throw error;
      }

      setProfile({
        fullName: data?.full_name || "",
        email: user?.email || "",
        createdAt: new Date(user?.created_at || "").toLocaleDateString(),
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error fetching profile",
        description: "Could not load your profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
      
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Could not update your profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarFallback className="bg-accent text-lg">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{profile.fullName || "Set your name"}</h2>
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarClock className="h-4 w-4 mr-2" />
                <span className="text-sm">Joined {profile.createdAt}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="py-4 space-y-4">
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <span className="block text-sm font-medium text-muted-foreground mb-1">Full Name</span>
                <span className="block">{profile.fullName || "Not set"}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-sm font-medium text-muted-foreground mb-1">Email</span>
                <span className="block">{profile.email}</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className={`${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
          {editing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditing(false)}
                className={isMobile ? "w-full" : ""}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={updateProfile}
                className={`${isMobile ? "w-full" : ""} gap-2`}
                disabled={loading}
              >
                {loading ? "Saving..." : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className={isMobile ? "w-full" : ""}
              >
                Sign Out
              </Button>
              <Button 
                onClick={() => setEditing(true)}
                className={`${isMobile ? "w-full" : ""} gap-2`}
                variant="secondary"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
