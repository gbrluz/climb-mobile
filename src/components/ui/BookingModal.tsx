import { X, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import type { Court, Club } from '../../types';
import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court;
  club: Club;
  selectedDate: string;
  selectedTime: string;
  onConfirm: (duration: number) => void;
  isLoading?: boolean;
}

export const BookingModal = ({
  isOpen,
  onClose,
  court,
  club,
  selectedDate,
  selectedTime,
  onConfirm,
  isLoading
}: BookingModalProps) => {
  const [duration, setDuration] = useState(60); // 60 minutos por padrão

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  const calculateTotal = () => {
    const hours = duration / 60;
    const pricePerHour = parseFloat(court.base_price);
    return (pricePerHour * hours).toFixed(2);
  };

  const handleConfirm = () => {
    onConfirm(duration);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">Confirmar Reserva</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informações da Quadra */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-1">{court.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin size={14} />
              {club.name}
            </p>
          </div>

          {/* Detalhes da Reserva */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Data</p>
                <p className="text-sm font-bold capitalize">{formatDate(selectedDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Horário</p>
                <p className="text-sm font-bold">{selectedTime}</p>
              </div>
            </div>
          </div>

          {/* Seletor de Duração */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Duração
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    duration === mins
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Resumo do Valor */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor por hora</span>
              <span className="font-bold text-gray-900">R$ {parseFloat(court.base_price).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duração</span>
              <span className="font-bold text-gray-900">{duration} minutos</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-blue-600">R$ {calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Botões */}
        <div className="p-6 border-t border-gray-100 space-y-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            {isLoading ? 'Processando...' : 'Confirmar Reserva'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold active:bg-gray-200 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
