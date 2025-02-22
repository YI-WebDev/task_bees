import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: {
      "X-Client-Info": "taskbees@1.0.0",
    },
  },
  db: {
    schema: "public",
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from("boards").select("id").limit(1);
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return false;
  }
}

export const handleSupabaseError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch")) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    return error.message;
  }
  return "An unexpected error occurred";
}
