import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { subscriptionSchema, SubscriptionFormData } from '@/lib/validationSchemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const EditSubscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      category: 'OTT',
      cost: '',
      billingCycle: 'Monthly',
      renewalDate: '',
      alertsEnabled: true,
    },
  });

  useEffect(() => {
    loadSubscription();
  }, [id]);

  const loadSubscription = async () => {
    try {
      setIsFetching(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        form.reset({
          name: data.name,
          category: data.category as 'OTT' | 'Fitness' | 'Software' | 'Other',
          cost: data.cost.toString(),
          billingCycle: data.billing_cycle as 'Monthly' | 'Yearly',
          renewalDate: data.next_renewal_date,
          alertsEnabled: data.alerts_enabled ?? true,
        });
      } else {
        toast({
          title: "Error",
          description: "Subscription not found",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          name: data.name,
          category: data.category,
          cost: parseFloat(data.cost),
          billing_cycle: data.billingCycle,
          next_renewal_date: data.renewalDate,
          alerts_enabled: data.alertsEnabled,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Subscription updated successfully",
      });
      
      navigate(`/subscription/${id}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/subscription/${id}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-card-foreground">Edit Subscription</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Info className="w-5 h-5 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Edit your subscription details including name, cost, billing cycle, and renewal date. Toggle alerts to get notified before renewals.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Netflix Premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="499" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={field.value === 'Monthly' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => field.onChange('Monthly')}
                        >
                          Monthly
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'Yearly' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => field.onChange('Yearly')}
                        >
                          Yearly
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="renewalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Renewal Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OTT">OTT / Streaming</SelectItem>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Software">Software / SaaS</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alertsEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <FormLabel className="text-base">Enable Renewal Alerts</FormLabel>
                        <p className="text-sm text-muted-foreground">Get notified before renewal</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Subscription'}
              </Button>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default EditSubscription;