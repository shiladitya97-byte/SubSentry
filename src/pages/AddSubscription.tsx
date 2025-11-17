import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddSubscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'OTT' as 'OTT' | 'Fitness' | 'Software' | 'Other',
    cost: '',
    billingCycle: 'Monthly' as 'Monthly' | 'Yearly',
    renewalDate: '',
    alertsEnabled: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input
                id="name"
                placeholder="Netflix Premium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                placeholder="499"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing">Billing Cycle</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.billingCycle === 'Monthly' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData({ ...formData, billingCycle: 'Monthly' })}
                >
                  Monthly
                </Button>
                <Button
                  type="button"
                  variant={formData.billingCycle === 'Yearly' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData({ ...formData, billingCycle: 'Yearly' })}
                >
                  Yearly
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewal">Next Renewal Date</Label>
              <Input
                id="renewal"
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OTT">OTT / Streaming</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Software">Software / SaaS</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="alerts" className="text-base">Enable Renewal Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified before renewal</p>
              </div>
              <Switch
                id="alerts"
                checked={formData.alertsEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, alertsEnabled: checked })}
              />
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <p className="text-sm text-accent-foreground">
                We'll remind you before it renews
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Save Subscription
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddSubscription;
