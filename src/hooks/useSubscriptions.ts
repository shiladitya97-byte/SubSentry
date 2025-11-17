import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

export const useSubscriptions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('next_renewal_date', { ascending: true });

      if (error) throw error;

      return data.map((sub) => ({
        id: sub.id,
        name: sub.name,
        category: sub.category as 'OTT' | 'Fitness' | 'Software' | 'Other',
        cost: Number(sub.cost),
        billingCycle: sub.billing_cycle as 'Monthly' | 'Yearly',
        nextRenewalDate: sub.next_renewal_date,
        alertsEnabled: sub.alerts_enabled,
        logo: sub.logo_url || undefined,
      })) as Subscription[];
    },
  });

  const addSubscription = useMutation({
    mutationFn: async (subscription: Omit<Subscription, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          name: subscription.name,
          category: subscription.category,
          cost: subscription.cost,
          billing_cycle: subscription.billingCycle,
          next_renewal_date: subscription.nextRenewalDate,
          alerts_enabled: subscription.alertsEnabled,
          logo_url: subscription.logo,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add subscription',
        variant: 'destructive',
      });
    },
  });

  const updateSubscription = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Subscription> }) => {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          name: updates.name,
          category: updates.category,
          cost: updates.cost,
          billing_cycle: updates.billingCycle,
          next_renewal_date: updates.nextRenewalDate,
          alerts_enabled: updates.alertsEnabled,
          logo_url: updates.logo,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription',
        variant: 'destructive',
      });
    },
  });

  const deleteSubscription = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete subscription',
        variant: 'destructive',
      });
    },
  });

  return {
    subscriptions,
    isLoading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
};
