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

  return (
    <>
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
        {club?.courts && club.courts.length > 0 ? (
          club.courts.map((court: any) => (
            <div key={court.id} className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{court.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {court.is_indoor ? '🏠 Coberta' : '☀️ Descoberta'} · {court.type || 'Padel'}
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                   R$ {parseFloat(court.base_price).toFixed(0)}/h
                </span>
              </div>
              
              <div className="mt-4">
  <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1">
    <Clock size={14} /> Horários disponíveis
  </h4>
  
  <div className="grid grid-cols-4 gap-2">
    {/* Simulando slots. No futuro, você buscará do seu AvailabilityService */}
    {['08:00', '09:30', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00'].map((time) => (
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
              <div className="grid grid-cols-4 gap-2 mt-4">
                 {/* Slots de horários */}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">Nenhuma quadra disponível</div>
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