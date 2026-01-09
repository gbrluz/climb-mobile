import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { ClubDetails } from './pages/ClubDetails';
import { ClubsList } from './pages/ClubsList';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';

// Inicializa o cliente do React Query para gerenciar cache das APIs
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Container Principal: Ocupa a tela toda sem padding */}
        <div className="flex flex-col h-screen bg-gray-50">

          {/* Área de Conteúdo com scroll independente */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-matches" element={<MyBookings />} />
              <Route path="/auctions" element={<div className="p-6 text-center"><h2 className="text-xl font-bold">Leilões em breve!</h2></div>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/club/:id" element={<ClubDetails />} />
              <Route path="/explore" element={<ClubsList />} />
            </Routes>
          </main>

          {/* Navegação fixa no rodapé */}
          <BottomNav />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;