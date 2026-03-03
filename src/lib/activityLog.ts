import { supabase } from '@/integrations/supabase/client';

export type EventType =
  | 'login'
  | 'signup'
  | 'logout'
  | 'pet_created'
  | 'pet_deleted'
  | 'training_completed'
  | 'vaccine_added'
  | 'weight_logged'
  | 'disease_added'
  | 'medication_added'
  | 'subscription_started'
  | 'plan_upgraded'
  | 'avatar_customized'
  | 'photo_uploaded';

export async function logActivity(eventType: EventType, metadata: Record<string, unknown> = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('activity_logs').insert([{
      user_id: user.id,
      event_type: eventType,
      metadata: metadata as any,
    }]);
  } catch {
    // Silent fail — analytics should never block UX
  }
}
