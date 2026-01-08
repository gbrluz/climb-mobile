# 📦 Guia de Dados Mockados - Climb Mobile

## O que foi implementado?

O Climb Mobile agora possui **suporte automático a dados mockados** quando a API **climb-bookings-api** não estiver disponível. Isso permite desenvolver e testar o frontend sem dependência do backend.

## Como funciona?

O sistema detecta automaticamente se a API está disponível:
- ✅ **API disponível**: Usa dados reais do backend
- 📦 **API indisponível**: Usa dados mockados automaticamente

## Dados Mockados Disponíveis

### Clubes (3 clubes)
1. **Sport Center Paulista** - Av. Paulista, São Paulo/SP
2. **Padel House Vila Mariana** - Rua Domingos de Morais, São Paulo/SP
3. **Arena Pinheiros** - Rua Butantã, São Paulo/SP

Cada clube possui imagens, descrição, amenidades e avaliações.

### Quadras
- **Clube 1**: 2 quadras (Panorâmica R$ 120/h, Coberta R$ 150/h)
- **Clube 2**: 2 quadras (Master R$ 140/h, Premium R$ 180/h)
- **Clube 3**: 1 quadra (Central R$ 130/h)

### Reservas
- 1 reserva de exemplo já confirmada
- Novas reservas são adicionadas dinamicamente

### Usuário
- Nome: Gabriel
- Email: gabriel@climb.com
- Nível: Intermediário

## Como Testar

### 1. **Sem API (modo mock automático)**

```bash
# Apenas inicie o frontend
npm run dev
```

O sistema detectará automaticamente que a API não está disponível e usará os mocks.

**Console mostrará:**
```
📦 API não disponível. Usando dados mockados para desenvolvimento.
```

### 2. **Com API Real**

```bash
# Terminal 1: Inicie a API
cd ../climb-bookings-api
npm run start:dev

# Terminal 2: Inicie o frontend
cd ../climb-mobile
npm run dev
```

Se a API estiver em `http://localhost:3000`, o frontend usará dados reais automaticamente.

## Funcionalidades que Funcionam com Mocks

✅ **Navegação de Clubes**
- Listar clubes na home
- Explorar todos os clubes
- Ver detalhes do clube
- Ver quadras disponíveis

✅ **Sistema de Reservas**
- Selecionar data e horário
- Escolher duração (60, 90, 120 min)
- Criar reserva
- Reserva é adicionada à lista

✅ **Minhas Reservas**
- Ver próximas reservas
- Cancelar reservas
- Ver histórico

✅ **Perfil**
- Ver informações do usuário
- Nível de habilidade

## Arquitetura

```
src/
├── mocks/
│   └── data.ts              # Dados mockados (clubes, quadras, etc)
├── services/
│   └── api.service.ts       # Service layer com fallback automático
└── hooks/
    ├── useClubs.ts         # Usa ApiService (automático)
    ├── useClubDetails.ts   # Usa ApiService (automático)
    ├── useBookings.ts      # Usa ApiService (automático)
    └── ...
```

### ApiService

O `ApiService` é uma camada de abstração que:
1. Detecta se a API está disponível (tenta `/health`)
2. Se disponível: faz requisição real
3. Se indisponível: retorna dados mockados
4. Cache a detecção para performance

```typescript
// Exemplo de uso (já implementado nos hooks)
import { ApiService } from '../services/api.service';

const clubs = await ApiService.getClubs();
```

## Personalizar Dados Mockados

Edite o arquivo `src/mocks/data.ts`:

```typescript
export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Seu Clube Aqui',
    city: 'São Paulo',
    // ... outros campos
  },
  // Adicione mais clubes
];
```

## Limitações dos Mocks

🔸 **Dados não persistem**: Ao recarregar a página, dados criados (reservas) são perdidos
🔸 **Sem validações**: Mocks não validam regras de negócio
🔸 **Dados fixos**: Horários disponíveis são sempre os mesmos
🔸 **Sem autenticação**: Não há login/logout real

## Quando Conectar à API Real?

Conecte à API real quando precisar:
- ✅ Testar validações de negócio
- ✅ Testar persistência real de dados
- ✅ Testar autenticação e autorização
- ✅ Testar integração completa

## Endpoints da API Real

Quando a API estiver rodando, certifique-se que estes endpoints existem:

```
GET    /clubs
GET    /clubs/:id
GET    /clubs/:id/courts
GET    /bookings
POST   /bookings
DELETE /bookings/:id
GET    /users/me
GET    /health (opcional, para detecção)
```

## Desabilitar Mocks Permanentemente

Se você quiser SEMPRE usar a API real (sem fallback):

1. Edite `src/services/api.service.ts`
2. Mude a função `checkApiHealth`:

```typescript
const checkApiHealth = async (): Promise<boolean> => {
  // Sempre usa API real, sem fallback
  return true;
};
```

## Solução de Problemas

### Mocks não estão sendo usados
- ✅ Verifique o console: deve aparecer a mensagem "📦 API não disponível..."
- ✅ Verifique se a API não está rodando em `localhost:3000`

### Quero forçar uso de mocks
- Pare a API (`localhost:3000`)
- Limpe o cache do navegador (Ctrl+Shift+R)

### Dados não aparecem
- ✅ Verifique o console do navegador por erros
- ✅ Verifique a aba Network se as "requisições" estão acontecendo

## Contribuindo

Para adicionar novos dados mockados:

1. **Adicione ao `src/mocks/data.ts`**
2. **Adicione método no `ApiService`**
3. **Crie hook correspondente**

Exemplo:

```typescript
// 1. Mock data
export const mockTournaments = [...];

// 2. ApiService
async getTournaments() {
  const isAvailable = await checkApiHealth();
  if (!isAvailable) return mockTournaments;
  const { data } = await bookingsApi.get('/tournaments');
  return data;
}

// 3. Hook
export const useTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: () => ApiService.getTournaments(),
  });
};
```

---

**Happy Coding! 🎾**
