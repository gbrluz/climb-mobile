// Componente de UI para o Filtro de Distância
export const FilterModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <div className={`fixed inset-0 z-50 bg-white transform transition-transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <button onClick={onClose} className="p-1">✕</button>
        <h2 className="font-bold text-lg">Filtrar</h2>
        <button className="text-blue-600 font-bold text-sm">Eliminar filtros</button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-140px)]">
        {/* Raio de Distância */}
        <div>
          <h3 className="font-bold mb-1">Intervalo de distância</h3>
          <p className="text-sm text-gray-500 mb-4">0m - 50km</p>
          <input type="range" min="1" max="50" className="w-full h-1 bg-blue-600 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-[10px] text-gray-400 mt-2">
            <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>30</span><span>50</span>
          </div>
        </div>

        {/* Tipo de Quadra */}
        <div>
          <h3 className="font-bold mb-4">Fecho</h3>
          <div className="flex gap-2">
            {['Indoor', 'Exterior', 'Cobertura'].map(tipo => (
              <button key={tipo} className="px-4 py-2 border rounded-full text-sm font-semibold">{tipo}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200">
          Ver resultados
        </button>
      </div>
    </div>
  );
};