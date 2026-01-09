// src/pages/ClubsList.tsx
import { useState } from 'react';
import { useClubs } from '../hooks/useClubs';
import { ClubCard } from '../components/ui/ClubCard';
import { Search, SlidersHorizontal, MapPin, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClubsList = () => {
  const navigate = useNavigate();
  const { data: clubs, isLoading } = useClubs();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white min-h-screen">
      {/* Header com Busca e Filtro */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft /></button>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input 
              placeholder="Buscar por cidade ou clube"
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Atalhos de Filtro */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold whitespace-nowrap">
            <SlidersHorizontal size={14} /> Filtrar
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold whitespace-nowrap border border-gray-200">
            Padel
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold whitespace-nowrap border border-gray-200">
            31 de dez. - 03 de jan.
          </button>
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <p className="text-gray-500 text-sm">Carregando clubes...</p>
        ) : (
          clubs?.map((club: any) => (
            <ClubCard
              key={club.id}
              name={club.name}
              address={`${club.city}, ${club.state}`}
              image={club.images?.[0]}
              onClick={() => navigate(`/club/${club.id}`)}
              distance="2km"
            />
          ))
        )}
      </div>
    </div>
  );
};