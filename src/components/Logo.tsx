import logo from '@/assets/subsentry-logo.png';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img src={logo} alt="SubSentry" className="h-8" />
    </div>
  );
};
