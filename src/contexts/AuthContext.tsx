import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, DonorProfile, HospitalProfile } from '../lib/supabase';

type Role = 'donor' | 'hospital' | null;

interface AuthContextType {
  session: Session | null;
  role: Role;
  isAdmin: boolean;
  donorProfile: DonorProfile | null;
  hospitalProfile: HospitalProfile | null;
  loading: boolean;
  signInAsAdmin: () => void;
  signOutAdmin: () => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  role: null,
  isAdmin: false,
  donorProfile: null,
  hospitalProfile: null,
  loading: true,
  signInAsAdmin: () => {},
  signOutAdmin: () => {},
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!roleData) { setLoading(false); return; }
      setRole(roleData.role as Role);

      if (roleData.role === 'donor') {
        const { data } = await supabase
          .from('donor_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        setDonorProfile(data);
        setHospitalProfile(null);
      } else if (roleData.role === 'hospital') {
        const { data } = await supabase
          .from('hospital_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        setHospitalProfile(data);
        setDonorProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
      } else {
        setRole(null);
        setDonorProfile(null);
        setHospitalProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (session) await loadProfile(session.user.id);
  }, [session, loadProfile]);

  const signOut = useCallback(async () => {
    setSession(null);
    setRole(null);
    setDonorProfile(null);
    setHospitalProfile(null);
    await supabase.auth.signOut();
  }, []);

  const signInAsAdmin = useCallback(() => setIsAdmin(true), []);
  const signOutAdmin = useCallback(() => setIsAdmin(false), []);

  return (
    <AuthContext.Provider
      value={{ session, role, isAdmin, donorProfile, hospitalProfile, loading, signInAsAdmin, signOutAdmin, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
