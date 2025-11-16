import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { mockAlertSettings } from '@/lib/mockData';
import { ArrowLeft, Bell } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AlertSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(mockAlertSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/success', { state: { message: "Alert preferences saved!" } });
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
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Notification Preferences</h1>
          <p className="text-muted-foreground mb-6">Stay on top of all subscriptions</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Renewal Alerts</h2>
              
              <div className="space-y-2">
                <Label htmlFor="timing">Alert Timing</Label>
                <Select
                  value={settings.daysBeforeAlert.toString()}
                  onValueChange={(value) => setSettings({ ...settings, daysBeforeAlert: parseInt(value) as 1 | 3 | 7 })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day Before</SelectItem>
                    <SelectItem value="3">3 Days Before</SelectItem>
                    <SelectItem value="7">7 Days Before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Notification Channels</Label>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Switch
                    id="email"
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                  <Switch
                    id="sms"
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="push">Push Notifications</Label>
                  </div>
                  <Switch
                    id="push"
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">Alert Preview</h2>
              <Card className="bg-primary/5 border-primary/20 p-4">
                <div className="flex gap-3">
                  <div className="bg-primary rounded-full p-2 h-fit">
                    <Bell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">SubSentry: Renewal Alert</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your Netflix subscription renews in {settings.daysBeforeAlert} {settings.daysBeforeAlert === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Save Preferences
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AlertSettings;
