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
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [imageError, setImageError] = useState(false);

  const { mutate: createBooking, isPending } = useCreateBooking();

  // Gera os próximos 7 dias para seleção
  const getNext7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      days.push({
        dayOfWeek: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        month: monthNames[date.getMonth()],
        fullDate: date.toISOString().split('T')[0],
        isToday: i === 0
      });
    }

    return days;
  };

  const weekDays = getNext7Days();

  // Gera horários disponíveis baseado no clube e slot da quadra
  const generateTimeSlots = (court: any) => {
    const openingTime = club?.opening_time || '08:00';
    const closingTime = club?.closing_time || '22:00';
    const slotDuration = court.slot_duration || 60;

    if (!slotDuration || slotDuration <= 0) {
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

  return (
    <>
      <div className="pb-24">
        {/* Header com Foto do Clube */}
        <div className="h-56 relative bg-gradient-to-br from-blue-500 to-blue-700">
          {club?.images?.[0] && !imageError ? (
            <img
              src={club.images[0]}
              alt={club.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-center">
                <Calendar size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Imagem não disponível</p>
              </div>
            </div>
          )}
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
        {/* Abas de Navegação */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button className="pb-3 px-1 font-bold text-blue-600 border-b-2 border-blue-600">
            Reservar
          </button>
          <button className="pb-3 px-1 font-semibold text-gray-400">
            Jogos Abertos
          </button>
          <button className="pb-3 px-1 font-semibold text-gray-400">
            Torneios/Ligas
          </button>
        </div>

        {/* Seletor de Data com Scroll Horizontal */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Calendar size={20} className="text-gray-600" />
            </button>
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1 scrollbar-hide">
              {weekDays.map((day) => (
                <button
                  key={day.fullDate}
                  onClick={() => setSelectedDate(day.fullDate)}
                  className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                    selectedDate === day.fullDate
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`text-xs font-semibold ${selectedDate === day.fullDate ? 'text-white' : 'text-gray-500'}`}>
                    {day.dayOfWeek}.
                  </span>
                  <span className="text-xl font-bold my-1">
                    {day.dayNumber}
                  </span>
                  <span className={`text-xs ${selectedDate === day.fullDate ? 'text-white' : 'text-gray-500'}`}>
                    {day.month}.
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Mostrar Apenas Disponíveis */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Mostrar apenas as horas disponíveis
            </span>
            <button
              onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showOnlyAvailable ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showOnlyAvailable ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Listagem de Quadras e Seus Horários */}
        <h2 className="text-lg font-bold mb-4">Quadras Disponíveis</h2>
        {club?.courts && club.courts.length > 0 ? (
          (() => {
            const activeCourts = club.courts.filter((c: any) => c.is_active !== false);

            if (activeCourts.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma quadra ativa no momento</p>
                  <p className="text-sm mt-2">Total de quadras: {club.courts.length}</p>
                </div>
              );
            }

            return activeCourts.map((court: any) => (
            <div key={court.id} className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{court.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {court.is_indoor ? '🏠 Coberta' : '☀️ Descoberta'} · {court.type ? court.type.charAt(0).toUpperCase() + court.type.slice(1) : 'Padel'}
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                   R$ {court.base_price ? parseFloat(court.base_price).toFixed(0) : '50'}/{court.slot_duration || 60}min
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
          ));
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