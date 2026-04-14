export interface Hotel {
  id: number;
  name: string;
  location: string;
  province: string;
  description: string;
  rating: number;
  stars: number;
  pricePerNight: number;
  currency: string;
  imageUrl: string;
  amenities: string[];
  category: string;
  isAllInclusive: boolean;
  phone: string;
  website: string;
}

export interface TouristSite {
  id: number;
  name: string;
  location: string;
  province: string;
  description: string;
  category: string;
  rating: number;
  imageUrl: string;
  isFree: boolean;
  entryFee?: number;
  activities: string[];
  bestTimeToVisit: string;
}

export interface ReservationRequest {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  guestName: string;
  guestEmail: string;
}

export interface ReservationResponse {
  confirmationCode: string;
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
  email: string;
  expiresAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
