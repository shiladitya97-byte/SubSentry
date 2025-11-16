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
          <div className="bg-success/10 rounded-full p-4">
            <CheckCircle2 className="w-16 h-16 text-success" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-card-foreground mb-2">You're all set!</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        
        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full"
          size="lg"
        >
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default Success;
