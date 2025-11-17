import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Settings, TrendingUp, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { subscriptions, isLoading } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billingCycle === 'Monthly' ? sub.cost : sub.cost / 12);
  }, 0);

  const totalYearly = totalMonthly * 12;

  const upcomingRenewals = subscriptions
    .filter(sub => {
      const daysUntil = Math.ceil(
        (new Date(sub.nextRenewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil <= 7;
    })
    .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime());

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <Card className="bg-primary text-primary-foreground p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium mb-1">Total Spending</h2>
              <p className="text-3xl font-bold">₹{totalMonthly.toFixed(2)}</p>
              <p className="text-sm opacity-90 mt-1">Monthly: ₹{totalMonthly.toFixed(2)}</p>
            </div>
            <div className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              All tracked
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search & Filter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card text-card-foreground border-0"
            />
          </div>
        </Card>

        {upcomingRenewals.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              Renewals in upcoming days
            </h3>
            <div className="space-y-3">
              {upcomingRenewals.map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onClick={() => navigate(`/subscription/${sub.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground px-1">
              Active Subscriptions
            </h3>
            <Button
              size="sm"
              onClick={() => navigate('/add-subscription')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </div>
          <div className="space-y-3">
            {filteredSubscriptions.map(sub => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onClick={() => navigate(`/subscription/${sub.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
