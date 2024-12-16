import React from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Twitter, Linkedin, Instagram, AtSign } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { ProfileData, SocialMedia } from "@/components/account/types"
import { useAuthState } from "@/hooks/useAuthState"
import { toast } from "sonner"

function ShareQRCode() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your profile</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">QR Code Placeholder</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function PublicProfile() {
  const params = useParams();
  const username = params.username?.replace('@', ''); // Remove @ if present
  const { user } = useAuthState();

  console.log("PublicProfile - Component mounted with params:", params);
  console.log("PublicProfile - Looking for username:", username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log("PublicProfile - Starting profile fetch for username:", username);
      
      if (!username) {
        console.error("PublicProfile - No username provided");
        toast.error("No username provided");
        throw new Error("No username provided");
      }

      try {
        console.log("PublicProfile - Executing Supabase query for username:", username);
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        console.log("PublicProfile - Query completed. Result:", { profiles, error });

        if (error) {
          console.error("PublicProfile - Supabase error:", error);
          toast.error("Error loading profile");
          throw error;
        }

        if (!profiles) {
          console.log("PublicProfile - No profile found");
          toast.error("Profile not found");
          return null;
        }

        // Parse social_media JSON if it exists
        const socialMedia = profiles.social_media ? 
          (typeof profiles.social_media === 'string' ? JSON.parse(profiles.social_media) : profiles.social_media) : 
          {
            x: null,
            linkedin: null,
            instagram: null,
            threads: null,
          };

        console.log("PublicProfile - Parsed social media:", socialMedia);

        // Convert the raw data to match ProfileData type
        const formattedProfile: ProfileData = {
          id: profiles.id,
          username: profiles.username,
          email: profiles.email,
          avatar_url: profiles.avatar_url,
          bio: profiles.bio,
          wallet_address: profiles.wallet_address,
          created_at: profiles.created_at,
          social_media: socialMedia as SocialMedia,
          interests: profiles.interests || [],
          show_upcoming_events: profiles.show_upcoming_events ?? true,
          show_past_events: profiles.show_past_events ?? true,
          past_events: profiles.past_events?.map((event: any) => ({
            id: event.id,
            title: event.title,
            date: event.date,
          })) || [],
          upcoming_events: profiles.upcoming_events?.map((event: any) => ({
            id: event.id,
            title: event.title,
            date: event.date,
          })) || [],
        };

        console.log("PublicProfile - Formatted profile data:", formattedProfile);
        return formattedProfile;
      } catch (error) {
        console.error("PublicProfile - Unexpected error:", error);
        toast.error("An unexpected error occurred while loading the profile");
        throw error;
      }
    },
    enabled: !!username,
  });

  console.log("PublicProfile - Current state:", { isLoading, error, profile });

  if (isLoading) {
    console.log("PublicProfile - Showing loading state");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("PublicProfile - Rendering error state:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading profile. Please try again later.
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log("PublicProfile - Rendering not found state");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Profile not found</h2>
          <p className="text-muted-foreground mt-2">
            The user @{username} doesn't exist or hasn't set up their profile yet.
          </p>
        </div>
      </div>
    );
  }

  console.log("PublicProfile - Rendering profile content");
  const socialMediaLinks = [
    { platform: "x", url: profile.social_media.x, icon: <Twitter /> },
    { platform: "linkedin", url: profile.social_media.linkedin, icon: <Linkedin /> },
    { platform: "instagram", url: profile.social_media.instagram, icon: <Instagram /> },
    { platform: "threads", url: profile.social_media.threads, icon: <AtSign /> },
  ].filter(link => link.url);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
            <AvatarImage src={profile.avatar_url || undefined} alt="Profile picture" />
            <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl sm:text-2xl font-semibold">@{profile.username}</h2>
          {profile.bio && <p className="text-center text-muted-foreground">{profile.bio}</p>}
        </div>

        {socialMediaLinks.length > 0 && (
          <div className="flex justify-center space-x-6">
            {socialMediaLinks.map(({ platform, url, icon }) => (
              <a
                key={platform}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                {React.cloneElement(icon, { className: "w-6 h-6 sm:w-7 sm:h-7" })}
                <span className="sr-only">{platform}</span>
              </a>
            ))}
          </div>
        )}

        {user?.id === profile.id && (
          <div className="flex justify-center space-x-4 w-full max-w-xs mx-auto">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.location.href = "/account"}
            >
              Edit Profile
            </Button>
            <ShareQRCode />
          </div>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs sm:text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {profile.show_upcoming_events && profile.upcoming_events && profile.upcoming_events.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.upcoming_events.map((event) => (
                <Card key={event.id} className="bg-[#080808] text-white">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm sm:text-base">{event.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {profile.show_past_events && profile.past_events && profile.past_events.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Past Events</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.past_events.map((event) => (
                <Card key={event.id} className="bg-[#080808] text-white">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm sm:text-base">{event.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}