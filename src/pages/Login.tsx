import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Chrome } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validationSchemas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if already authenticated and redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        // Sign up flow
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) throw error;

        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
        
        // Switch to login mode after successful signup
        setIsSignUp(false);
        form.reset();
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Authentication failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Authentication failed',
        description: error.message || 'Failed to sign in with Google.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo className="mb-4" />
            <p className="text-muted-foreground text-sm">Take control of your subscriptions</p>
          </div>

          <Button
            variant="outline"
            className="w-full mb-4 gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5" />
            Sign in with Google
          </Button>

          <Button
            className="w-full mb-6"
            onClick={() => setIsSignUp(true)}
            disabled={isLoading}
          >
            Sign Up with Email
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
              
              {isSignUp && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setIsSignUp(false);
                    form.reset();
                  }}
                  disabled={isLoading}
                >
                  Back to Log In
                </Button>
              )}
            </form>
          </Form>

          {!isSignUp && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
