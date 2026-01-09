// src/components/ui/PageHeader.tsx
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export const PageHeader = ({ title, onBack }: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className="bg-white px-4 pb-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-50"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))'
      }}
    >
      <button
        onClick={handleBack}
        className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-colors touch-manipulation"
        aria-label="Voltar"
      >
        <ChevronLeft size={24} className="text-gray-900" />
      </button>
      <h1 className="text-lg font-bold text-gray-900 flex-1 truncate">{title}</h1>
    </div>
  );
};
