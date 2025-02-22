import { supabase } from "../lib/supabase";

interface ProfileUpdateData {
  username?: string;
  email?: string;
  updated_at: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window.location.origin}/boards`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: username,
      },
    },
  });

  if (error) throw error;
  return data;
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export async function updateProfile(userId: string, data: ProfileUpdateData) {
  const { error: profileError } = await supabase.from("profiles").update(data).eq("id", userId);

  if (profileError) throw profileError;
}

export async function updateUserProfile(userId: string, username: string, email?: string) {
  const { error: updateError } = await supabase.auth.updateUser({
    data: { username },
    ...(email ? { email } : {}),
  });

  if (updateError) throw updateError;

  await updateProfile(userId, {
    username,
    ...(email ? { email } : {}),
    updated_at: new Date().toISOString(),
  });
}

export async function updateUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}