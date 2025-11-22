import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "Action completed successfully!";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#8EE3B0]/20 rounded-full p-6">
            <div className="bg-[#8EE3B0] rounded-full p-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">You're all set!</h1>
        <p className="text-muted-foreground mb-4">Your subscription has been saved successfully.</p>
        <p className="text-sm text-muted-foreground mb-8">
          We'll send you renewal alerts so you never miss a payment.
        </p>
        
        {/* Status indicators */}
        <div className="flex items-center justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 text-[#8EE3B0]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span>Alerts Enabled</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tracked</span>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default Success;
