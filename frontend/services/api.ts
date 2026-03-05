import { Conversation, Listing, Message, MyListing, MyListingsStats, Review, User } from '@/types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

function mapListing(r: any): import('@/types').Listing {
  return {
    id: r.id,
    title: r.title,
    price: Number(r.price),
    priceType: r.price_type,
    category: r.category,
    condition: r.condition,
    description: r.description,
    images: (r.images ?? []).map((img: any) => img.image_url),
    sellerId: r.seller_id,
    sellerName: r.seller_name ?? '',
    sellerRating: r.seller_rating ?? 0,
    sellerYear: r.seller_year ?? '',
    isVerified: r.is_verified ?? false,
    postedAt: r.created_at,
    meetupLocation: r.meeting_location ?? undefined,
  };
}

let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_authToken) headers['Authorization'] = `Bearer ${_authToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    let detail = `API error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = `${res.status}: ${body.detail}`;
    } catch {}
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

type MeResponse = { user_id: string; name: string; email: string };

export const api = {
  // Auth
  login: (email: string, password: string): Promise<MeResponse & { access_token: string }> =>
    request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string): Promise<MeResponse & { access_token: string }> =>
    request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  getMe: (): Promise<MeResponse> =>
    request<MeResponse>('/api/v1/auth/me'),

  // Listings
  getListings: async (category?: string, search?: string): Promise<Listing[]> => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const query = params.toString();
    const raw = await request<any[]>(`/api/v1/listings${query ? `?${query}` : ''}`);
    return raw.map(mapListing);
  },

  getListing: async (id: string): Promise<Listing> => {
    const raw = await request<any>(`/api/v1/listings/${id}`);
    return mapListing(raw);
  },

  createListing: (data: {
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    price_type: string;
    meeting_location: string;
    image_urls: string[];
  }): Promise<{ id: string }> =>
    request('/api/v1/listings', { method: 'POST', body: JSON.stringify(data) }),

  getMyListings: (status?: string): Promise<MyListing[]> => {
    const q = status ? `?status=${status}` : '';
    return request<MyListing[]>(`/api/v1/listings/me${q}`);
  },

  getMyListingsStats: (): Promise<MyListingsStats> =>
    request<MyListingsStats>('/api/v1/listings/me/stats'),

  updateListing: (id: string, data: Partial<{ status: string; title: string; price: number }>): Promise<Listing> =>
    request<Listing>(`/api/v1/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteListing: (id: string): Promise<void> =>
    request<void>(`/api/v1/listings/${id}`, { method: 'DELETE' }),

  // Conversations & Messages
  getConversations: (): Promise<Conversation[]> =>
    request<Conversation[]>('/api/v1/conversations/me'),

  createConversation: (listingId: string, sellerId: string): Promise<{ id: string }> =>
    request<{ id: string }>('/api/v1/conversations', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId, participant_ids: [sellerId] }),
    }),

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const raw = await request<any[]>(`/api/v1/conversations/${conversationId}/messages`);
    return raw.map((m) => ({ id: m.id, conversationId: m.conversation_id, senderId: m.sender_id, text: m.content, sentAt: m.created_at }));
  },

  sendMessage: async (conversationId: string, text: string): Promise<Message> => {
    const m = await request<any>(`/api/v1/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return { id: m.id, conversationId: m.conversation_id, senderId: m.sender_id, text: m.content, sentAt: m.created_at };
  },

  // Profile
  getMyProfile: (): Promise<User> =>
    request<User>('/api/v1/users/me'),

  getProfile: (userId: string): Promise<User> =>
    request<User>(`/api/v1/users/${userId}`),

  getReviews: (userId: string): Promise<Review[]> =>
    request<Review[]>(`/api/v1/users/${userId}/reviews`),

  // Offers
  createOffer: (
    listingId: string,
    cashOffer: number,
    tradeItemIds: string[],
    message: string,
  ): Promise<void> =>
    request<void>('/api/v1/offers', {
      method: 'POST',
      body: JSON.stringify({ listingId, cashOffer, tradeItemIds, message }),
    }),
};
