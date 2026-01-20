
import { createClient } from '@supabase/supabase-js';

// These environment variables are assumed to be provided in the environment
const supabaseUrl = process.env.SUPABASE_URL || 'https://awotvmrhchnaisuzbftb.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b3R2bXJoY2huYWlzdXpiZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzQ4MzAsImV4cCI6MjA4NDQ1MDgzMH0.BLKQn7TNxbdBxRpS1hERTyWQuQlo5SecQOuJP3d-28c';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
