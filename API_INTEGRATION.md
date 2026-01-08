# Climb Mobile - Integração com API

Este documento descreve a integração do frontend Climb Mobile com a API climb-bookings-api.

## Arquitetura

### Tecnologias
- **React 19.2** com TypeScript
- **React Query** para gerenciamento de estado servidor
- **Zustand** para estado de autenticação
- **Axios** para requisições HTTP
- **Tailwind CSS** para estilização
- **React Router v7** para navegação

### Estrutura de Pastas

```
src/
├── api/
│   └── instances.ts          # Configuração do Axios
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx     # Navegação inferior
│   └── ui/
│       ├── ClubCard.tsx      # Card de clube
│       ├── CourtCard.tsx     # Card de quadra
│       ├── BookingModal.tsx  # Modal de confirmação
│       ├── LoadingSpinner.tsx # Componentes de loading
│       └── ErrorMessage.tsx  # Componentes de erro
├── hooks/
│   ├── useClubs.ts           # Busca clubes
│   ├── useClubDetails.ts     # Detalhes do clube
│   ├── useBookings.ts        # Lista reservas
│   ├── useCreateBooking.ts   # Cria reserva
│   ├── useCancelBooking.ts   # Cancela reserva
│   └── useUserProfile.ts     # Perfil do usuário
├── pages/
│   ├── Home.tsx              # Página inicial
│   ├── ClubsList.tsx         # Lista de clubes
│   ├── ClubDetails.tsx       # Detalhes e reserva
│   ├── MyBookings.tsx        # Minhas reservas
│   └── Profile.tsx           # Perfil do usuário
├── store/
│   └── authStore.ts          # Estado de autenticação
└── types/
    └── index.ts              # Tipos TypeScript
```

## Endpoints Consumidos

### Clubes
- `GET /clubs` - Lista todos os clubes
- `GET /clubs/:id` - Detalhes de um clube
- `GET /clubs/:id/courts` - Quadras de um clube

### Reservas
- `GET /bookings` - Lista reservas do usuário
- `GET /bookings/:id` - Detalhes de uma reserva
- `POST /bookings` - Cria nova reserva
  ```json
  {
    "court_id": "string",
    "start_time": "2024-01-08T14:00:00.000Z",
    "duration_minutes": 60
  }
  ```
- `DELETE /bookings/:id` - Cancela uma reserva

### Usuário
- `GET /users/me` - Dados do usuário autenticado

## Funcionalidades Implementadas

### 1. Navegação de Clubes
- **Home**: Clubes sugeridos com scroll horizontal
- **Explorar**: Lista completa com busca e filtros
- **Detalhes**: Informações do clube e quadras disponíveis

### 2. Sistema de Reservas
- Seleção de data e horário
- Modal de confirmação com escolha de duração
- Cálculo automático do preço total
- Feedback visual de sucesso/erro

### 3. Minhas Reservas
- Listagem de próximas reservas
- Histórico de reservas passadas
- Cancelamento de reservas
- Estados visuais por status (confirmada, pendente, cancelada)

### 4. Perfil do Usuário
- Informações pessoais
- Nível de habilidade
- Configurações do app

### 5. Gerenciamento de Estado
- **React Query**: Cache automático de dados da API
- **Zustand**: Persistência de autenticação
- **Axios Interceptor**: Token automático nos headers

## Autenticação

O app utiliza Zustand para gerenciar autenticação:

```typescript
// Para fazer login
const { setAuth } = useAuthStore();
setAuth('token-jwt', 'user-id');

// Para logout
const { clearAuth } = useAuthStore();
clearAuth();

// Verificar autenticação
const { isAuthenticated, token } = useAuthStore();
```

O token é automaticamente incluído em todas as requisições via interceptor do Axios.

## Fluxo de Uso

1. **Descobrir Clubes**
   - Home → Ver clubes sugeridos
   - Explorar → Buscar e filtrar clubes

2. **Fazer Reserva**
   - Selecionar clube → Ver detalhes
   - Escolher data e horário
   - Confirmar no modal → Escolher duração
   - Reserva criada!

3. **Gerenciar Reservas**
   - Partidas → Ver minhas reservas
   - Cancelar se necessário
   - Ver histórico

4. **Perfil**
   - Ver informações pessoais
   - Ajustar configurações

## Padrão Visual

### Cores
- **Primary Blue**: `#0052FF`
- **Secondary Blue**: `#00C2FF`
- **Success Green**: `#10B981`
- **Error Red**: `#EF4444`
- **Warning Yellow**: `#F59E0B`

### Componentes
- Cards com `rounded-2xl` ou `rounded-3xl`
- Sombras suaves com `shadow-sm` ou `shadow-lg`
- Bordas com `border-gray-100`
- Botões com `active:scale-95` para feedback tátil

### Responsividade
- Mobile-first design
- Safe area support para iOS
- Bottom navigation fixo
- Scroll independente por página

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Configuração da API

Edite `src/api/instances.ts` para apontar para sua API:

```typescript
export const bookingsApi = axios.create({
  baseURL: 'http://localhost:3000', // Altere aqui
});
```

## Próximos Passos

- [ ] Implementar tela de login/registro
- [ ] Adicionar funcionalidade de "Partidas" (matchmaking)
- [ ] Implementar sistema de "Leilões"
- [ ] Adicionar filtros avançados de quadras
- [ ] Implementar sistema de avaliações
- [ ] Adicionar notificações push
- [ ] Integrar pagamentos

## Notas Técnicas

- Todas as requisições usam TypeScript para type-safety
- React Query gerencia cache automaticamente (5 minutos stale time)
- Dados de autenticação persistem no localStorage
- Componentes otimizados para performance mobile
- Suporte a Capacitor para build nativo iOS/Android
