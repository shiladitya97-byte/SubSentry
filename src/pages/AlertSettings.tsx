import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, MessageSquare, Bell, Loader2 } from 'lucide-react';

const AlertSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [daysBeforeAlert, setDaysBeforeAlert] = useState<number>(3);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  useEffect(() => {
    loadAlertSettings();
  }, []);

  const loadAlertSettings = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('alert_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setDaysBeforeAlert(data.days_before_alert ?? 3);
        setEmailEnabled(data.email_enabled ?? true);
        setSmsEnabled(data.sms_enabled ?? false);
        setPushEnabled(data.push_enabled ?? true);
      }
    } catch (error) {
      console.error('Error loading alert settings:', error);
      toast({
        title: "Error",
        description: "Failed to load alert settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('alert_settings')
        .update({
          days_before_alert: daysBeforeAlert,
          email_enabled: emailEnabled,
          sms_enabled: smsEnabled,
          push_enabled: pushEnabled,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert preferences saved successfully",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving alert settings:', error);
      toast({
        title: "Error",
        description: "Failed to save alert settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="p-6">
            <div className="space-y-8">
              {/* Alert Timing Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-1">Alert Timing</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose when you want to be notified before renewals
                  </p>
                </div>

                <RadioGroup value={daysBeforeAlert.toString()} onValueChange={(value) => setDaysBeforeAlert(parseInt(value))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="1day" />
                    <Label htmlFor="1day" className="font-normal cursor-pointer">1 day before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="3days" />
                    <Label htmlFor="3days" className="font-normal cursor-pointer">3 days before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7" id="7days" />
                    <Label htmlFor="7days" className="font-normal cursor-pointer">7 days before</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Notification Channels Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-1">Notification Channels</h2>
                  <p className="text-sm text-muted-foreground">
                    Select how you want to receive renewal alerts
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Get alerts via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={emailEnabled}
                      onCheckedChange={setEmailEnabled}
                    />
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Get alerts via text message</p>
                      </div>
                    </div>
                    <Switch
                      checked={smsEnabled}
                      onCheckedChange={setSmsEnabled}
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                        <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Get alerts on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={pushEnabled}
                      onCheckedChange={setPushEnabled}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full" 
                size="lg"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AlertSettings;
