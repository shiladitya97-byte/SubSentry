import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings, Calendar, RefreshCw, Info, Loader2, AlertTriangle } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import type { Subscription } from '@/types/subscription';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const categoryIcons = {
  OTT: Video,
  Fitness: Dumbbell,
  Software: Code,
  Other: Package,
};

const categoryDescriptions = {
  OTT: 'Streaming service for movies and TV shows',
  Fitness: 'Health and fitness tracking platform',
  Software: 'Software and productivity tools',
  Other: 'Subscription service',
};

const SubscriptionDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, [id]);

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
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
        const formattedData: Subscription = {
          id: data.id,
          name: data.name,
          category: data.category as 'OTT' | 'Fitness' | 'Software' | 'Other',
          cost: Number(data.cost),
          billingCycle: data.billing_cycle as 'Monthly' | 'Yearly',
          nextRenewalDate: data.next_renewal_date,
          alertsEnabled: data.alerts_enabled,
          logo: data.logo_url,
        };
        setSubscription(formattedData);
        setAlertsEnabled(formattedData.alertsEnabled);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertsToggle = async (enabled: boolean) => {
    if (!subscription) return;
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ alerts_enabled: enabled })
        .eq('id', subscription.id);

      if (error) throw error;

      setAlertsEnabled(enabled);
      toast({
        title: "Success",
        description: `Renewal alerts ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating alerts:', error);
      toast({
        title: "Error",
        description: "Failed to update alerts",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!subscription) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscription.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      });
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Subscription not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const renewalDate = new Date(subscription.nextRenewalDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  renewalDate.setHours(0, 0, 0, 0);
  const daysUntilRenewal = Math.round((renewalDate.getTime() - today.getTime()) / msPerDay);

  const renewalLabel =
    daysUntilRenewal > 1
      ? `Next renewal in ${daysUntilRenewal} days`
      : daysUntilRenewal === 1
      ? 'Next renewal is tomorrow'
      : daysUntilRenewal === 0
      ? 'Next renewal is today'
      : daysUntilRenewal === -1
      ? 'Renewal was yesterday'
      : `Renewal overdue by ${Math.abs(daysUntilRenewal)} days`;

  const isOverdue = daysUntilRenewal < 0;

  const Icon = categoryIcons[subscription.category];
  const description = categoryDescriptions[subscription.category];

  // Calculate costs
  const monthlyCost = subscription.billingCycle === 'Monthly' ? subscription.cost : subscription.cost / 12;
  const quarterlyCost = monthlyCost * 3;
  const annualCost = monthlyCost * 12;

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <Card className="p-6 space-y-6">
          {/* Header with icon, name, and cost */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <BrandLogo name={subscription.name} category={subscription.category} size="lg" />

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{subscription.name}</h1>
                <p className="text-muted-foreground mb-1">{subscription.category}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">₹{subscription.cost}</p>
              <p className="text-sm text-muted-foreground">per {subscription.billingCycle.toLowerCase()}</p>
            </div>
          </div>

          {/* Next Renewal and Billing Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Next Renewal</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {new Date(subscription.nextRenewalDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <RefreshCw className="w-5 h-5" />
                <span className="font-semibold">Billing Frequency</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{subscription.billingCycle}</p>
            </div>
          </div>

          {/* Alert Info Box */}
          <div className={`rounded-lg p-4 flex items-center gap-3 ${isOverdue ? 'bg-destructive/10 border border-destructive/20' : 'bg-orange-50 border border-orange-200'}`}>
            <Info className={`w-5 h-5 flex-shrink-0 ${isOverdue ? 'text-destructive' : 'text-orange-500'}`} />
            <p className={`font-medium ${isOverdue ? 'text-destructive' : 'text-orange-700'}`}>
              {renewalLabel}
            </p>
          </div>

          {/* Renewal Alerts */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Renewal Alerts</h2>
                <p className="text-sm text-muted-foreground">Get notified before this subscription renews</p>
              </div>
              <Switch
                checked={alertsEnabled}
                onCheckedChange={handleAlertsToggle}
              />
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Cost Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Monthly Cost</span>
                <span className="text-lg font-semibold text-foreground">₹{monthlyCost.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Quarterly Cost</span>
                <span className="text-lg font-semibold text-foreground">₹{quarterlyCost.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Annual Cost</span>
                <span className="text-lg font-semibold text-foreground">₹{annualCost.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/edit-subscription/${id}`)}
            >
              Edit Subscription
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Subscription
            </Button>
          </div>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-destructive/10 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Subscription?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete <span className="font-semibold text-foreground">{subscription?.name}</span>? 
              This action cannot be undone and you'll lose all tracking history for this subscription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel disabled={isDeleting} className="sm:flex-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:flex-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionDetail;
