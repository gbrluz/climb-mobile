interface CourtCardProps {
  name: string;
  type: string; // Saibro, Beach, etc.
  price: number;
  image: string;
  onReserve: () => void;
}

export const CourtCard = ({ name, type, price, image, onReserve }: CourtCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-500 text-sm">{type}</p>
          </div>
          <span className="text-blue-600 font-bold">R$ {price}</span>
        </div>
        <button 
          onClick={onReserve}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold active:scale-95 transition-transform"
        >
          Reservar agora
        </button>
      </div>
    </div>
  );
};