import { Shield } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-primary rounded-full p-2">
        <Shield className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-semibold text-navy">SubSentry</span>
    </div>
  );
};
