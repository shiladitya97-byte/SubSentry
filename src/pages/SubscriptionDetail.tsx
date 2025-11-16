import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { mockSubscriptions } from '@/lib/mockData';
import { ArrowLeft, Video, Settings } from 'lucide-react';

const SubscriptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const subscription = mockSubscriptions.find(sub => sub.id === id);
  const [alertsEnabled, setAlertsEnabled] = useState(subscription?.alertsEnabled ?? true);

  if (!subscription) {
    return <div>Subscription not found</div>;
  }

  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.nextRenewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
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
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-card-foreground mb-1">{subscription.name}</h1>
              <div className="inline-block bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                Next renewal in {daysUntilRenewal} days
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">Subscription Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{subscription.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renewal Date:</span>
                  <span className="font-medium">{new Date(subscription.nextRenewalDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-medium text-primary">₹{subscription.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium">{subscription.billingCycle}</span>
                </div>
              </div>
            </div>

            <div className="border-b border-border pb-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">Settings</h2>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="alerts" className="text-base">Renewal Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified before renewal</p>
                </div>
                <Switch
                  id="alerts"
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
              onClick={handleDelete}
            >
              Delete Subscription
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SubscriptionDetail;
