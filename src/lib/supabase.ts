import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://wtnnrguzhfrommijhoqd.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bm5yZ3V6aGZyb21taWpob3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTIxODIsImV4cCI6MjA5MzYyODE4Mn0.e1YbnLGVro1BW8EiaBdF0NVwubGEll8qdrhp7IQI6UY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Temp client for admin creating hospital accounts (no session persistence)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export interface DonorProfile {
  id: string;
  full_name: string;
  phone: string | null;
  blood_group: string;
  age: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  last_donation_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface HospitalProfile {
  id: string;
  hospital_name: string;
  username: string;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  hospital_id: string;
  blood_group: string;
  units_needed: number;
  urgency: 'urgent' | 'scheduled';
  scheduled_at: string | null;
  notes: string | null;
  status: 'active' | 'fulfilled' | 'cancelled';
  created_at: string;
  updated_at: string;
  hospital?: HospitalProfile;
}

export interface RequestCommitment {
  id: string;
  request_id: string;
  donor_id: string;
  status: 'committed' | 'cancelled' | 'completed';
  committed_at: string;
  current_latitude: number | null;
  current_longitude: number | null;
  location_updated_at: string | null;
  donor?: DonorProfile;
  request?: BloodRequest;
}
