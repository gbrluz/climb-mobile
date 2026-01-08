// src/components/ui/ClubCard.tsx
import { MapPin, Star } from 'lucide-react';

interface ClubCardProps {
  name: string;
  address: string;
  rating: number;
  image: string;
  onClick: () => void;
}

export const ClubCard = ({ name, address, rating, image, onClick }: ClubCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform"
    >
      <div className="relative h-48 bg-gray-200"> {/* Placeholder cinza se não houver imagem */}
        <img 
          src={image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCQa90Egj9nUWlylRmVaVOdBXCJKWEM6cRfA&s?q=80&w=800'} // Imagem padrão
          alt={name} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold">{rating || '5.0'}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {address || 'Endereço não informado'}
        </p>
      </div>
    </div>
  );
};