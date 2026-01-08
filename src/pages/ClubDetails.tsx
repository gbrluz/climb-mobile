// src/pages/ClubDetails.tsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useClubDetails } from '../hooks/useClubDetails';
import { Calendar, Clock } from 'lucide-react';
import { useCreateBooking } from '../hooks/useCreateBooking';

export const ClubDetails = () => {
  const { id } = useParams();
  const { data: club, isLoading } = useClubDetails(id!);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { mutate: createBooking } = useCreateBooking();

const handleOpenConfirmation = (court: any, time: string) => {
  const confirmReserva = window.confirm(`Deseja confirmar a reserva na ${court.name} às ${time}?`);
  
  if (confirmReserva) {
    // Formata a data selecionada + horário para o ISO que o backend espera
    const startTime = `${selectedDate}T${time}:00.000Z`;
    
    createBooking({
      court_id: court.id,
      start_time: startTime
    });
  }
};

  if (isLoading) return <div className="p-6">Carregando clube...</div>;

  return (
    <div className="pb-24">
      {/* Header com Foto do Clube */}
      <div className="h-56 relative bg-gray-200">
        <img 
          src={club?.images?.[0] || ''} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
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
                <h3 className="font-bold text-gray-800">{court.name}</h3>
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                   R$ {court.base_price}/h
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
  );

  function handleReservation(courtId: string, time: string) {
    // Aqui enviaremos para o backend usando o seu create-booking.dto.ts
    const startTime = `${selectedDate}T${time}:00.000Z`;
    console.log("Reservando quadra:", courtId, "no horário:", startTime);
    alert(`Iniciando reserva para ${time}`);
  }
};