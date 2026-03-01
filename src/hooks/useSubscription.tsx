import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subscription {
  id: string;
  plan_type: string;
  started_at: string;
  expires_at: string;
  is_active: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  isActive: boolean;
  daysLeft: number;
  isTrial: boolean;
  startTrial: () => Promise<void>;
  activatePlan: (planType: string) => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) { setSubscription(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription(data as Subscription | null);
    setLoading(false);
  };

  useEffect(() => { fetchSubscription(); }, [user]);

  const now = new Date();
  const expiresAt = subscription ? new Date(subscription.expires_at) : null;
  const isActive = !!subscription && !!expiresAt && expiresAt > now;
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 86400000)) : 0;
  const isTrial = subscription?.plan_type === 'trial';

  const startTrial = async () => {
    if (!user) return;
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 3);
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: 'trial',
      expires_at: trialEnd.toISOString(),
    });
    await fetchSubscription();
  };

  const activatePlan = async (planType: string) => {
    if (!user) return;
    // Deactivate old subscriptions
    await supabase.from('subscriptions').update({ is_active: false }).eq('user_id', user.id);

    const daysMap: Record<string, number> = { monthly: 30, semiannual: 180, annual: 365 };
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + (daysMap[planType] || 30));

    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: planType,
      expires_at: expireDate.toISOString(),
    });
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription, loading, isActive, daysLeft, isTrial,
      startTrial, activatePlan, refreshSubscription: fetchSubscription,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be inside SubscriptionProvider');
  return ctx;
}
