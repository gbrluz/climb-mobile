import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { ClubDetails } from './pages/ClubDetails';
import { ClubsList } from './pages/ClubsList';

// Importe outras páginas conforme for criando (ClubDetails, Profile, etc.)

// Inicializa o cliente do React Query para gerenciar cache das APIs
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Container Principal: Ocupa a tela toda e respeita o index.css */}
        <div className="flex flex-col h-screen-dynamic bg-gray-50 overflow-hidden">
          
          {/* Área de Conteúdo com scroll independente e Safe Area superior */}
          <main className="flex-1 overflow-y-auto px-4 pt-safe-top pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-matches" element={<div>Página de Partidas</div>} />
              <Route path="/auctions" element={<div>Página de Leilões</div>} />
              <Route path="/profile" element={<div>Perfil do Usuário</div>} />
              <Route path="/club/:id" element={<ClubDetails />} />
              <Route path="/explore" element={<ClubsList />} />
            </Routes>
          </main>

          {/* Navegação fixa no rodapé que você já criou */}
          <BottomNav />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;