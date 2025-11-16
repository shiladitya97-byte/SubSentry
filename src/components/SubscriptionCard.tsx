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

  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.nextRenewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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
      {daysUntilRenewal <= 7 && (
        <div className="mt-3 text-xs text-muted-foreground">
          Renews in {daysUntilRenewal} {daysUntilRenewal === 1 ? 'day' : 'days'}
        </div>
      )}
    </Card>
  );
};
