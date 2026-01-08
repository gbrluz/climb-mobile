import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useClubDetails } from '../hooks/useClubDetails';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { BookingModal } from '../components/ui/BookingModal';
import { LoadingPage } from '../components/ui/LoadingSpinner';
import { ErrorPage } from '../components/ui/ErrorMessage';
import type { Court } from '../types';

export const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: club, isLoading, error, refetch } = useClubDetails(id!);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const { mutate: createBooking, isPending } = useCreateBooking();

  // Debug: Estado inicial do componente
  console.log('🚀 ClubDetails montado:', {
    clubId: id,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    hasClub: !!club,
    clubName: club?.name
  });

  // Gera horários disponíveis baseado no clube e slot da quadra
  const generateTimeSlots = (court: Court) => {
    const openingTime = club?.opening_time || '08:00';
    const closingTime = club?.closing_time || '22:00';
    const slotDuration = court.slot_duration;

    console.log('🕐 Gerando horários:', {
      club: club?.name,
      openingTime,
      closingTime,
      slotDuration,
      court: court.name
    });

    if (!slotDuration || slotDuration <= 0) {
      console.error('❌ slot_duration inválido:', slotDuration);
      return [];
    }

    const [openHour, openMin] = openingTime.split(':').map(Number);
    const [closeHour, closeMin] = closingTime.split(':').map(Number);

    const startMinutes = openHour * 60 + openMin;
    const endMinutes = closeHour * 60 + closeMin;

    const slots: string[] = [];
    let currentMinutes = startMinutes;

    while (currentMinutes + slotDuration <= endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      slots.push(timeString);
      currentMinutes += slotDuration;
    }

    console.log('✅ Horários gerados:', slots.length, slots);
    return slots;
  };

  const handleOpenConfirmation = (court: Court, time: string) => {
    setSelectedCourt(court);
    setSelectedTime(time);
    setModalOpen(true);
  };

  const handleConfirmBooking = (duration: number) => {
    if (!selectedCourt) return;

    const startTime = `${selectedDate}T${selectedTime}:00.000Z`;

    createBooking({
      court_id: selectedCourt.id,
      start_time: startTime,
      duration_minutes: duration
    }, {
      onSuccess: () => {
        setModalOpen(false);
        alert('Reserva realizada com sucesso!');
        navigate('/find-matches'); // Navega para minhas reservas
      },
      onError: (error: any) => {
        alert(`Erro ao reservar: ${error.response?.data?.message || 'Tente novamente'}`);
      }
    });
  };

  if (isLoading) return <LoadingPage message="Carregando clube..." />;
  if (error) return <ErrorPage message="Erro ao carregar clube" onRetry={() => refetch()} />;
  if (!club) return <ErrorPage message="Clube não encontrado" />;

  // Debug: Log das quadras
  console.log('🏟️ Clube carregado:', {
    name: club.name,
    totalCourts: club.courts?.length || 0,
    courts: club.courts,
    openingTime: club.opening_time,
    closingTime: club.closing_time
  });

  return (
    <>
      {/* Debug Panel - Remove em produção */}
      {import.meta.env.DEV && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b-2 border-yellow-400 p-2 text-xs z-50 max-h-32 overflow-auto">
          <div className="font-bold">🔍 DEBUG INFO:</div>
          <div>Club ID: {id}</div>
          <div>Loading: {isLoading ? '✅' : '❌'}</div>
          <div>Error: {error ? `❌ ${error.message}` : '✅'}</div>
          <div>Club: {club ? `✅ ${club.name}` : '❌'}</div>
          <div>Courts Total: {club?.courts?.length || 0}</div>
          <div>Courts Active: {club?.courts?.filter((c: any) => c.is_active).length || 0}</div>
          {club?.courts && club.courts.length > 0 && (
            <div className="mt-1">
              Courts: {club.courts.map((c: any) =>
                `${c.name}(active:${c.is_active}, slot:${c.slot_duration}min, price:R$${c.base_price})`
              ).join(' | ')}
            </div>
          )}
        </div>
      )}
      <div className="pb-24">
        {/* Header com Foto do Clube */}
        <div className="h-56 relative bg-gray-200">
          <img
            src={club?.images?.[0] || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Botão Voltar */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full active:bg-white/30"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-black">{club?.name}</h1>
            <p className="text-sm opacity-90">{club?.city}, {club?.state}</p>
          </div>
        </div>

      <div className="p-4">
        {/* Seletor de Data Simples */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Calendar size={20} className="text-blue-600" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="font-bold text-gray-700 focus:outline-none"
          />
        </div>

        {/* Listagem de Quadras e Seus Horários */}
        <h2 className="text-lg font-bold mb-4">Quadras Disponíveis</h2>
        {(() => {
          const totalCourts = club?.courts?.length || 0;
          const activeCourts = club?.courts?.filter((c: any) => c.is_active) || [];
          console.log('📋 Filtrando quadras:', {
            total: totalCourts,
            ativas: activeCourts.length,
            todasQuadras: club?.courts,
            courtDetails: club?.courts?.map((c: any) => ({
              id: c.id,
              name: c.name,
              is_active: c.is_active,
              slot_duration: c.slot_duration,
              base_price: c.base_price
            }))
          });
          return null;
        })()}
        {club?.courts && club.courts.length > 0 ? (
          (() => {
            const activeCourts = club.courts.filter((c: any) => c.is_active);

            if (activeCourts.length === 0) {
              console.warn('⚠️ Nenhuma quadra ativa encontrada');
              return (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma quadra ativa no momento</p>
                  <p className="text-sm mt-2">Total de quadras: {club.courts.length}</p>
                </div>
              );
            }

            return activeCourts.map((court: any) => {
            console.log('🎾 Renderizando quadra:', court.name, court);
            return (
            <div key={court.id} className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{court.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {court.is_indoor ? '🏠 Coberta' : '☀️ Descoberta'} · {court.type ? court.type.charAt(0).toUpperCase() + court.type.slice(1) : 'Padel'}
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                   R$ {court.base_price ? parseFloat(court.base_price).toFixed(0) : '0'}/{court.slot_duration || 0}min
                </span>
              </div>
              
              <div className="mt-4">
  <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1">
    <Clock size={14} /> Horários disponíveis
  </h4>
  
  <div className="grid grid-cols-4 gap-2">
    {generateTimeSlots(court).map((time) => (
      <button
        key={time}
        className="py-2 text-sm font-bold rounded-xl border border-blue-100 text-blue-700 bg-blue-50 active:bg-blue-600 active:text-white transition-all shadow-sm"
        onClick={() => handleOpenConfirmation(court, time)}
      >
        {time}
      </button>
    ))}
  </div>
</div>
            </div>
          );
          });
          })()
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma quadra cadastrada</p>
          </div>
        )}
      </div>
      </div>

      {/* Modal de Confirmação */}
      {selectedCourt && club && (
        <BookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          court={selectedCourt}
          club={club}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onConfirm={handleConfirmBooking}
          isLoading={isPending}
        />
      )}
    </>
  );
};