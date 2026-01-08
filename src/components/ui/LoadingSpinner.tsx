import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    </div>
  );
};

export const LoadingPage = ({ message = 'Carregando...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
};
