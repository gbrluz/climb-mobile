import { useBookings } from '../hooks/useBookings';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { LoadingPage } from '../components/ui/LoadingSpinner';
import { ErrorPage } from '../components/ui/ErrorMessage';
import { PageHeader } from '../components/ui/PageHeader';
import { Calendar, Clock, MapPin, XCircle, CheckCircle } from 'lucide-react';
import type { Booking } from '../types';
import { useState } from 'react';

export const MyBookings = () => {
  const { data: bookings, isLoading, error, refetch } = useBookings();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelBooking = (booking: Booking) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja cancelar a reserva em ${booking.court?.name || 'esta quadra'}?`
    );

    if (confirmed) {
      setCancellingId(booking.id);
      cancelBooking(booking.id, {
        onSuccess: () => {
          setCancellingId(null);
        },
        onError: (error: any) => {
          setCancellingId(null);
          alert(`Erro ao cancelar: ${error.response?.data?.message || 'Tente novamente'}`);
        }
      });
    }
  };

  if (isLoading) return <LoadingPage message="Carregando suas reservas..." />;
  if (error) return <ErrorPage message="Erro ao carregar reservas" onRetry={() => refetch()} />;

  const upcomingBookings = bookings?.filter(
    b => b.status !== 'cancelled' && new Date(b.start_time) >= new Date()
  ) || [];

  const pastBookings = bookings?.filter(
    b => b.status === 'cancelled' || new Date(b.start_time) < new Date()
  ) || [];

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <PageHeader title="Minhas Reservas" />

      <div className="p-4 space-y-6">
        {/* Próximas Reservas */}
        {upcomingBookings.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Próximas</h2>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  isCancelling={cancellingId === booking.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Histórico */}
        {pastBookings.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Histórico</h2>
            <div className="space-y-3">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isPast
                />
              ))}
            </div>
          </section>
        )}

        {/* Estado vazio */}
        {!bookings || bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="bg-gray-100 p-6 rounded-full">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Nenhuma reserva ainda</h3>
            <p className="text-gray-500 text-center max-w-xs">
              Quando você fizer uma reserva, ela aparecerá aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  isCancelling?: boolean;
  isPast?: boolean;
}

const BookingCard = ({ booking, onCancel, isCancelling, isPast }: BookingCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{booking.court?.name || 'Quadra'}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={14} />
            {booking.club?.name || 'Clube'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar size={16} className="text-blue-600" />
          <span className="font-medium">{formatDate(booking.start_time)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock size={16} className="text-blue-600" />
          <span className="font-medium">{formatTime(booking.start_time)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-lg font-bold text-gray-900">
          R$ {booking.total_price?.toFixed(2) || '0.00'}
        </div>

        {!isPast && booking.status !== 'cancelled' && onCancel && (
          <button
            onClick={() => onCancel(booking)}
            disabled={isCancelling}
            className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold text-sm rounded-xl border border-red-200 bg-red-50 active:bg-red-100 disabled:opacity-50"
          >
            <XCircle size={16} />
            {isCancelling ? 'Cancelando...' : 'Cancelar'}
          </button>
        )}
      </div>
    </div>
  );
};
