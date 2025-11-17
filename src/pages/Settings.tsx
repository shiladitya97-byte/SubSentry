import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { mockUserSettings } from '@/lib/mockData';
import { ArrowLeft, User } from 'lucide-react';
import { userSettingsSchema, UserSettingsFormData } from '@/lib/validationSchemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const Settings = () => {
  const navigate = useNavigate();
  
  const form = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: mockUserSettings,
  });

  const onSubmit = (data: UserSettingsFormData) => {
    console.log('Settings validated:', data);
    navigate('/success', { state: { message: "Settings saved successfully!" } });
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
          <h1 className="text-2xl font-bold text-card-foreground mb-6">Settings</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">Profile</h2>
                
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="bg-primary rounded-full p-3">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{form.watch('name')}</p>
                    <p className="text-sm text-muted-foreground">{form.watch('email')}</p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-4">Currency</h2>
                    <FormControl>
                      <div className="flex gap-2">
                        {['₹', '$', '€'].map((currency) => (
                          <Button
                            key={currency}
                            type="button"
                            variant={field.value === currency ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => field.onChange(currency)}
                          >
                            {currency}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">Notifications</h2>
                
                <FormField
                  control={form.control}
                  name="billingAlertsEnabled"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <FormLabel>Billing Alerts</FormLabel>
                          <p className="text-sm text-muted-foreground">Get notified about renewals</p>
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

                <FormField
                  control={form.control}
                  name="promotionalOffersEnabled"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <FormLabel>Promotional Offers</FormLabel>
                          <p className="text-sm text-muted-foreground">Updates and tips</p>
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

                <Button type="button" variant="ghost" className="w-full justify-start text-destructive">
                  Log out
                </Button>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Save Changes
              </Button>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
