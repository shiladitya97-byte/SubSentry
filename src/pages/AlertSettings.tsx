import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
import { alertSettingsSchema, AlertSettingsFormData } from '@/lib/validationSchemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const AlertSettings = () => {
  const navigate = useNavigate();
  
  const form = useForm<AlertSettingsFormData>({
    resolver: zodResolver(alertSettingsSchema),
    defaultValues: mockAlertSettings,
  });

  const onSubmit = (data: AlertSettingsFormData) => {
    console.log('Alert settings validated:', data);
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">Renewal Alerts</h2>
                
                <FormField
                  control={form.control}
                  name="daysBeforeAlert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Timing</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Day Before</SelectItem>
                          <SelectItem value="3">3 Days Before</SelectItem>
                          <SelectItem value="7">7 Days Before</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Notification Channels</FormLabel>
                  
                  <FormField
                    control={form.control}
                    name="emailEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <FormLabel>Email</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="smsEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <FormLabel>SMS</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="pushEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <FormLabel>Push Notifications</FormLabel>
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
                </div>
              </div>

              <div className="bg-accent p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent-foreground" />
                  <p className="text-sm font-medium text-accent-foreground">Alert Preview</p>
                </div>
                <p className="text-sm text-accent-foreground">
                  "Your Netflix subscription renews in {form.watch('daysBeforeAlert')} day(s). Click here to review."
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Save Preferences
              </Button>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default AlertSettings;
