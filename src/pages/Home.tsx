// src/pages/Home.tsx
import { useClubs } from '../hooks/useClubs';
import { ClubCard } from '../components/ui/ClubCard';
import { UpperNav } from '../components/ui/UpperNav';
import { Calendar, GraduationCap, Trophy, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { data: clubs, isLoading } = useClubs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <UpperNav />
      <div className="space-y-8 pb-10 px-4 pt-4">
      {/* 1. Header de Boas-vindas */}
      <section className="pt-4">
        <h1 className="text-2xl font-black text-gray-900">Bem-vindo, Gabriel!</h1>
        <p className="text-gray-500 font-medium">Pronto para jogar?</p>
      </section>

      {/* 2. Quick Actions (Ações Rápidas) */}
      <div className="grid grid-cols-4 gap-2">
        <QuickAction icon={<Calendar />} label="Reservar" color="bg-lime-400" />
        <QuickAction icon={<GraduationCap />} label="Aprender" color="bg-yellow-300" />
        <QuickAction icon={<Trophy />} label="Competir" color="bg-emerald-400" />
        <QuickAction icon={<Search />} label="Jogos" color="bg-green-400" />
      </div>

      {/* 3. Seção de Clubes com Scroll Horizontal */}
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xl font-bold text-gray-900">Clubes sugeridos</h2>
          <button onClick={() => navigate('/explore')} className="text-blue-600 font-bold text-sm">
            Ver todos
            </button>
        </div>

        {/* Container do Scroll Horizontal */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2">
          {isLoading ? (
            <p className="text-gray-500 text-sm">Carregando clubes...</p>
          ) : (
            clubs?.map((club: any) => (
              <div key={club.id} className="snap-start min-w-[280px] max-w-[280px]">
                <ClubCard
                  name={club.name}
                  address={`${club.city}, ${club.state}`}
                  image={club.images?.[0]}
                  onClick={() => navigate(`/club/${club.id}`)}
                  distance="2km"
                />
              </div>
            ))
          )}
        </div>
      </section>
      </div>
    </div>
  );
};

// Componente auxiliar para os botões redondos
const QuickAction = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`${color} p-4 rounded-full text-gray-900 shadow-sm active:scale-95 transition-transform`}>
      {icon}
    </div>
    <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">{label}</span>
  </div>
);