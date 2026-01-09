// src/components/ui/ClubCard.tsx
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface ClubCardProps {
  name: string;
  address: string;
  image: string;
  onClick: () => void;
  distance?: string;
}

export const ClubCard = ({ name, address, image, onClick, distance }: ClubCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform touch-manipulation"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <Calendar size={40} className="text-white opacity-30" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {distance && <span className="font-medium">{distance} · </span>}
          {address || 'Endereço não informado'}
        </p>
      </div>
    </div>
  );
};