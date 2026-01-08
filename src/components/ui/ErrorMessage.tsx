import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({
  message = 'Algo deu errado. Tente novamente.',
  onRetry
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-6">
      <div className="bg-red-50 p-4 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <p className="text-gray-700 font-medium text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold active:bg-blue-700"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export const ErrorPage = ({
  message = 'Algo deu errado. Tente novamente.',
  onRetry
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      <div className="bg-red-50 p-6 rounded-full">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Ops!</h2>
      <p className="text-gray-700 font-medium text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold active:bg-blue-700 shadow-lg"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};
