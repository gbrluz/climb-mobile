// Service layer para abstrair chamadas à API
import { bookingsApi } from '../api/instances';
import type { Club, Court, Booking, User, CreateBookingDto } from '../types';

export const ApiService = {
  // Clubs
  async getClubs(): Promise<Club[]> {
    const { data } = await bookingsApi.get<Club[]>('/clubs');
    return data;
  },

  async getClubById(id: string): Promise<Club> {
    // A API não tem endpoint /clubs/:id, então busca todos e filtra
    const { data } = await bookingsApi.get<Club[]>('/clubs');
    const club = data.find(c => c.id === id);
    if (!club) throw new Error('Club not found');
    return club;
  },

  async getClubCourts(clubId: string): Promise<Court[]> {
    const { data } = await bookingsApi.get<Court[]>(`/clubs/${clubId}/courts`);
    return data;
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const { data } = await bookingsApi.get<Booking[]>('/bookings');
    return data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const { data } = await bookingsApi.get<Booking>(`/bookings/${id}`);
    return data;
  },

  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    const { data } = await bookingsApi.post<Booking>('/bookings', bookingData);
    return data;
  },

  async cancelBooking(id: string): Promise<void> {
    await bookingsApi.delete(`/bookings/${id}`);
  },

  // Users
  async getUserProfile(): Promise<User> {
    const { data } = await bookingsApi.get<User>('/users/me');
    return data;
  },
};
