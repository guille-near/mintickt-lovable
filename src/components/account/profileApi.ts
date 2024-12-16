import { supabase } from "@/integrations/supabase/client";
import { ProfileDbData } from "./types";
import { Json } from "@/integrations/supabase/types";

export const fetchProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return profile;
};

export const createProfile = async (userId: string, email: string): Promise<ProfileDbData> => {
  const newProfile: ProfileDbData = {
    id: userId,
    email: email,
    first_name: null,
    last_name: null,
    username: null,
    bio: null,
    wallet_address: null,
    avatar_url: null,
    social_media: {
      x: null,
      linkedin: null,
      instagram: null,
      threads: null
    } as Json,
    interests: [],
    show_upcoming_events: true,
    show_past_events: true,
    past_events: [],
    upcoming_events: [],
    created_at: new Date().toISOString()
  };

  const { data: createdProfile, error } = await supabase
    .from('profiles')
    .insert([newProfile])
    .select()
    .single();

  if (error) throw error;
  return createdProfile;
};

export const updateProfile = async (userId: string, profile: Partial<ProfileDbData>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};