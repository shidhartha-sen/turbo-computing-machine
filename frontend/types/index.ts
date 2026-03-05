export type Listing = {
  id: string;
  title: string;
  price: number;
  priceType: 'cash' | 'trade' | 'both';
  category: string;
  condition: string;
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerYear: string;
  isVerified: boolean;
  postedAt: string;
  meetupLocation?: string;
};

export type User = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  year: string;
  faculty: string;
  isVerified: boolean;
  listingsCount: number;
  tradesCount: number;
  reviewsCount: number;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  sentAt: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  isVerifiedUser: boolean;
  tradeProposed?: boolean;
};

export type MyListing = {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'sold' | 'traded';
  images: { id: string; image_url: string }[];
  views_count: number;
  expires_at: string | null;
  active_chats: number;
  offers_count: number;
  created_at: string;
};

export type MyListingsStats = {
  active: number;
  sold: number;
  total_views: number;
};

export type Review = {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
};
