import { Subscription } from '@/types/subscription';
import { Card } from '@/components/ui/card';
import { Video, Dumbbell, Code, Package } from 'lucide-react';

const categoryIcons = {
  OTT: Video,
  Fitness: Dumbbell,
  Software: Code,
  Other: Package,
};

const categoryColors = {
  OTT: 'bg-blue-100 text-blue-600',
  Fitness: 'bg-green-100 text-green-600',
  Software: 'bg-purple-100 text-purple-600',
  Other: 'bg-gray-100 text-gray-600',
};

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick?: () => void;
}

export const SubscriptionCard = ({ subscription, onClick }: SubscriptionCardProps) => {
  const Icon = categoryIcons[subscription.category];
  const colorClass = categoryColors[subscription.category];

  const msPerDay = 1000 * 60 * 60 * 24;
  const renewalDate = new Date(subscription.nextRenewalDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  renewalDate.setHours(0, 0, 0, 0);
  const daysUntilRenewal = Math.round((renewalDate.getTime() - today.getTime()) / msPerDay);

  const renewalLabel =
    daysUntilRenewal > 1
      ? `Renews in ${daysUntilRenewal} days`
      : daysUntilRenewal === 1
      ? 'Renews tomorrow'
      : daysUntilRenewal === 0
      ? 'Renews today'
      : daysUntilRenewal === -1
      ? 'Renewal was yesterday'
      : `Renewal overdue by ${Math.abs(daysUntilRenewal)} days`;

  const isOverdue = daysUntilRenewal < 0;

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground">{subscription.name}</h3>
            <p className="text-sm text-muted-foreground">{subscription.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-card-foreground">₹{subscription.cost}</p>
          <p className="text-xs text-muted-foreground">{subscription.billingCycle}</p>
        </div>
      </div>
      <div className={`mt-3 text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
        {renewalLabel}
      </div>
    </Card>
  );
};
