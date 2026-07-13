import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { ChatAssistant } from '@/components/ChatAssistant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Settings, TrendingUp, Loader2, Bell, Calendar, Filter, ArrowUpDown, Download } from 'lucide-react';
import { downloadSubscriptionsReport } from '@/lib/exportReport';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { Subscription } from '@/types/subscription';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Soonest Renewal');
  const [isLoading, setIsLoading] = useState(true);

  type SortOption = { label: string; value: string };
  const sortOptions: SortOption[] = [
    { label: 'Soonest Renewal', value: 'Soonest Renewal' },
    { label: 'Highest Monthly Cost', value: 'Highest Monthly Cost' },
    { label: 'Name (A-Z)', value: 'Name (A-Z)' },
    { label: 'Name (Z-A)', value: 'Name (Z-A)' },
  ];

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
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
        .eq('user_id', user.id)
        .order('next_renewal_date', { ascending: true });

      if (error) throw error;

      const formattedData: Subscription[] = (data || []).map(sub => ({
        id: sub.id,
        name: sub.name,
        category: sub.category as 'OTT' | 'Fitness' | 'Software' | 'Other',
        cost: Number(sub.cost),
        billingCycle: sub.billing_cycle as 'Monthly' | 'Yearly',
        nextRenewalDate: sub.next_renewal_date,
        alertsEnabled: sub.alerts_enabled,
        logo: sub.logo_url,
      }));

      setSubscriptions(formattedData);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const filteredSubscriptions = subscriptions
    .filter(sub => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || sub.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Soonest Renewal':
          return new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
        case 'Highest Monthly Cost': {
          const monthlyA = a.billingCycle === 'Monthly' ? a.cost : a.cost / 12;
          const monthlyB = b.billingCycle === 'Monthly' ? b.cost : b.cost / 12;
          return monthlyB - monthlyA;
        }
        case 'Name (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Name (Z-A)':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/alert-settings')}
              aria-label="Alert settings"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open calendar">
                  <Calendar className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <CalendarPicker
                  mode="single"
                  selected={new Date()}
                  defaultMonth={new Date()}
                  today={new Date()}
                  initialFocus
                  modifiers={{
                    renewal: subscriptions.map(s => new Date(s.nextRenewalDate)),
                  }}
                  modifiersClassNames={{
                    renewal:
                      'relative font-semibold text-primary after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-primary',
                  }}
                  className={cn('p-3 pointer-events-auto')}
                />
                {subscriptions.length > 0 && (
                  <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Upcoming renewal
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card text-card-foreground border-0"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2 bg-card text-card-foreground hover:bg-card/90">
                  <Filter className="w-4 h-4" />
                  {categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['All', 'OTT', 'Fitness', 'Software', 'Other'].map(cat => (
                  <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2 bg-card text-card-foreground hover:bg-card/90">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortOptions.map(opt => (
                  <DropdownMenuItem key={opt.value} onClick={() => setSortBy(opt.value)}>
                    {opt.label}
                    {sortBy === opt.value && <span className="ml-auto text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {upcomingRenewals.length > 0 && (
          <div id="upcoming-renewals">
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
          </>
        )}
      </main>
      
      <ChatAssistant />
    </div>
  );
};

export default Dashboard;
