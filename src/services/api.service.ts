// Service layer para abstrair chamadas à API
import { bookingsApi } from '../api/instances';
import { mockClubs, mockCourts, mockBookings, mockUser } from '../mocks/data';
import type { Club, Court, Booking, User, CreateBookingDto } from '../types';

// Detecta se a API está disponível
let apiAvailable: boolean | null = null;

const checkApiHealth = async (): Promise<boolean> => {
  if (apiAvailable !== null) return apiAvailable;

  try {
    // Tenta buscar clubes para verificar se API está disponível
    await bookingsApi.get('/clubs', { timeout: 2000 });
    apiAvailable = true;
    console.log('✅ API conectada com sucesso!');
    return true;
  } catch {
    console.warn('📦 API não disponível. Usando dados mockados para desenvolvimento.');
    apiAvailable = false;
    return false;
  }
};

export const ApiService = {
  // Clubs
  async getClubs(): Promise<Club[]> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      return Promise.resolve(mockClubs);
    }

    try {
      const { data } = await bookingsApi.get<Club[]>('/clubs');
      return data;
    } catch {
      return mockClubs;
    }
  },

  async getClubById(id: string): Promise<Club> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      const club = mockClubs.find(c => c.id === id);
      if (!club) throw new Error('Club not found');
      return Promise.resolve(club);
    }

    try {
      // A API não tem endpoint /clubs/:id, então busca todos e filtra
      const { data } = await bookingsApi.get<Club[]>('/clubs');
      const club = data.find(c => c.id === id);
      if (!club) throw new Error('Club not found');
      return club;
    } catch {
      const club = mockClubs.find(c => c.id === id);
      if (!club) throw new Error('Club not found');
      return club;
    }
  },

  async getClubCourts(clubId: string): Promise<Court[]> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      return Promise.resolve(mockCourts[clubId] || []);
    }

    try {
      const { data } = await bookingsApi.get<Court[]>(`/clubs/${clubId}/courts`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar quadras:', error);
      return mockCourts[clubId] || [];
    }
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      return Promise.resolve(mockBookings);
    }

    try {
      const { data } = await bookingsApi.get<Booking[]>('/bookings');
      return data;
    } catch {
      return mockBookings;
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) throw new Error('Booking not found');
      return Promise.resolve(booking);
    }

    try {
      const { data } = await bookingsApi.get<Booking>(`/bookings/${id}`);
      return data;
    } catch {
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) throw new Error('Booking not found');
      return booking;
    }
  },

  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      // Simula criação de booking
      const newBooking: Booking = {
        id: `b${Date.now()}`,
        court_id: bookingData.court_id,
        user_id: 'u1',
        start_time: bookingData.start_time,
        end_time: new Date(
          new Date(bookingData.start_time).getTime() + (bookingData.duration_minutes || 60) * 60000
        ).toISOString(),
        duration_minutes: bookingData.duration_minutes || 60,
        total_price: 120,
        status: 'confirmed',
        payment_status: 'pending',
        notes: bookingData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockBookings.push(newBooking);
      return Promise.resolve(newBooking);
    }

    const { data } = await bookingsApi.post<Booking>('/bookings', bookingData);
    return data;
  },

  async cancelBooking(id: string): Promise<void> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      const index = mockBookings.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBookings[index].status = 'cancelled';
      }
      return Promise.resolve();
    }

    await bookingsApi.delete(`/bookings/${id}`);
  },

  // Users
  async getUserProfile(): Promise<User> {
    const isApiAvailable = await checkApiHealth();

    if (!isApiAvailable) {
      return Promise.resolve(mockUser);
    }

    try {
      const { data } = await bookingsApi.get<User>('/users/me');
      return data;
    } catch {
      return mockUser;
    }
  },
};
