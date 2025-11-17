import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Bell } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, profile, isLoading, updateSettings } = useUserSettings();
  const [formData, setFormData] = useState({
    currency: '₹' as '₹' | '$' | '€',
    theme: 'light' as 'light' | 'dark',
    billingAlertsEnabled: true,
    promotionalOffersEnabled: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency as '₹' | '$' | '€',
        theme: settings.theme as 'light' | 'dark',
        billingAlertsEnabled: settings.billing_alerts_enabled,
        promotionalOffersEnabled: settings.promotional_offers_enabled,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(formData);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-card-foreground mb-6">Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Profile</h2>
              
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="bg-primary rounded-full p-3">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{profile?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Currency</h2>
              
              <div className="flex gap-2">
                {['₹', '$', '€'].map((currency) => (
                  <Button
                    key={currency}
                    type="button"
                    variant={formData.currency === currency ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setFormData({ ...formData, currency: currency as any })}
                  >
                    {currency}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Notifications</h2>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="billing-alerts">Billing Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about renewals</p>
                </div>
                <Switch
                  id="billing-alerts"
                  checked={formData.billingAlertsEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, billingAlertsEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="promo-offers">Promotional Offers</Label>
                  <p className="text-sm text-muted-foreground">Updates and tips</p>
                </div>
                <Switch
                  id="promo-offers"
                  checked={formData.promotionalOffersEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, promotionalOffersEnabled: checked })}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => navigate('/alert-settings')}
              >
                <Bell className="w-4 h-4" />
                Manage Alert Preferences
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Theme</h2>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.theme === 'light' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData({ ...formData, theme: 'light' })}
                >
                  Light Mode
                </Button>
                <Button
                  type="button"
                  variant={formData.theme === 'dark' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData({ ...formData, theme: 'dark' })}
                >
                  Dark Mode
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Save Settings
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
