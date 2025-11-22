import { ShieldCheck } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={2.5} />
      <span className="text-2xl font-bold text-primary">SubSentry</span>
    </div>
  );
};
