// Tipos da API climb-bookings-api

export type Club = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  images?: string[];
  description?: string;
  amenities?: string[];
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export type Court = {
  id: string;
  club_id: string;
  name: string;
  type: 'padel' | 'tennis' | 'beach_tennis' | 'squash';
  indoor: boolean;
  base_price: number;
  status: 'active' | 'maintenance' | 'inactive';
  features?: string[];
  created_at?: string;
  updated_at?: string;
}

export type Booking = {
  id: string;
  court_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status?: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos populados
  court?: Court;
  club?: Club;
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  preferred_position?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export type ClubWithCourts = Club & {
  courts: Court[];
}

export type CreateBookingDto = {
  court_id: string;
  start_time: string;
  duration_minutes?: number;
  notes?: string;
}

export type ApiError = {
  message: string;
  statusCode?: number;
  error?: string;
}
