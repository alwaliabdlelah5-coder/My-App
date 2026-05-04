import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  updated_at?: string;
  name: string;
  status: 'نشط' | 'غير نشط';
  email: string;
  lastLogin: string;
}

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });
      
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        const mappedData = data.map((p: any) => ({
          ...p,
          name: p.full_name || 'Generic User',
          email: p.email || 'user@example.com',
          status: 'نشط' as const,
          lastLogin: 'أول دخول'
        }));
        setUsers(mappedData as any[]);
      }
      setLoading(false);
    };

    fetchUsers();

    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addUser = async (data: { name: string, role: string, email: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ 
          id: crypto.randomUUID(),
          full_name: data.name,
          role: data.role
        }]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding user profile:', error);
    }
  };

  return { users, loading, addUser };
}
