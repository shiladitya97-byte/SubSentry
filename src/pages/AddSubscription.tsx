import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Info } from 'lucide-react';
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

const AddSubscription = () => {
  const navigate = useNavigate();
  
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

  const onSubmit = (data: SubscriptionFormData) => {
    console.log('Form validated:', data);
    navigate('/success', { state: { message: "Subscription added successfully!" } });
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
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-card-foreground">Add New Subscription</h1>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Info className="w-5 h-5 text-primary" />
            </Button>
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

              <div className="bg-accent p-4 rounded-lg">
                <p className="text-sm text-accent-foreground">
                  We'll remind you before it renews
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Save Subscription
              </Button>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default AddSubscription;
