# USask Marketplace — Full Screen Implementation Plan

## Context
Build all screens from the Figma design into the existing Expo/React Native app. The app is a student marketplace for USask where students can buy, sell, and trade textbooks and gear. The project uses Expo Router, NativeWind (Tailwind), lucide-react-native icons, and an existing green/yellow theme (`themes/theme.ts`). Backend is FastAPI. User wants to connect to the real backend API and Make Offer as a separate full screen.

---

## Screens to Build

| Screen | File | Status |
|---|---|---|
| Home Feed | `app/(tabs)/index.tsx` | Replace placeholder |
| Messages List | `app/(tabs)/message.tsx` | Replace placeholder |
| My Items | `app/(tabs)/myItems.tsx` | Replace placeholder |
| Profile | `app/(tabs)/profile.tsx` | Replace placeholder |
| Item Details | `app/listing/[id].tsx` | New file |
| Make Offer | `app/make-offer/[id].tsx` | New file |
| Chat | `app/chat/[id].tsx` | New file |

---

## Components to Create

### `components/listing/`
- **`ListingCard.tsx`** — Card with image, title, price, category, trade badge, posted time. Used in Home Feed and My Items.
- **`CategoryChip.tsx`** — Pill filter chip (All / Textbooks / Lab Gear / etc). Active state uses primary green bg.
- **`BadgeTag.tsx`** — Small badge: "USask Verified", "Like New", "Trade". Reusable with variant prop.

### `components/home/`
- **`HomeHeader.tsx`** — Green USask header bar with avatar left, "University of Saskatchewan" title, notification icon right.
- **`SearchBar.tsx`** — Rounded search input with search icon, grey bg.

### `components/chat/`
- **`ChatBubble.tsx`** — Message bubble: mine (yellow, right-aligned) vs theirs (white, left-aligned).
- **`QuickActionChip.tsx`** — Tappable chip: "Campus Spot 🏫", "Set Time 🕐", "Payment Method".
- **`ConversationItem.tsx`** — Row in messages list: avatar, name, last message preview, timestamp.

### `components/profile/`
- **`SellerCard.tsx`** — Seller avatar, name, star rating, year/faculty label, "View Profile" button.

### `components/offer/`
- **`TradeItemCard.tsx`** — Selectable card showing one of my items. Yellow border when selected.

---

## Types

### `types/index.ts`
```typescript
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
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  isVerifiedUser: boolean;
  tradeProposed?: boolean;
};
```

---

## API Service

### `services/api.ts`
- Base URL from `process.env.EXPO_PUBLIC_API_URL` (defaults to `http://localhost:8000`)
- Functions:
  - `getListings(category?, search?): Promise<Listing[]>`
  - `getListing(id): Promise<Listing>`
  - `getConversations(): Promise<Conversation[]>`
  - `getMessages(conversationId): Promise<Message[]>`
  - `sendMessage(conversationId, text): Promise<Message>`
  - `getMyListings(): Promise<Listing[]>`
  - `getMyProfile(): Promise<User>`
  - `createOffer(listingId, cashOffer, tradeItemIds, message): Promise<void>`

---

## Screen Designs (from Figma)

### Home Feed (`index.tsx`)
- `HomeHeader` at top (green bg, avatar, title, notif icon)
- `SearchBar` below header
- `CategoryChip` horizontal scroll row (All, Textbooks, Lab Gear...)
- "Recent Listings" section header + "See all" link
- 2-column grid of `ListingCard`
- Yellow `+ Post` FAB (bottom right, above tab bar)
- Tapping a card → navigate to `app/listing/[id]`

### Item Details (`app/listing/[id].tsx`)
- Image carousel (dots indicator)
- Title, price, "Posted X ago"
- `BadgeTag` row: USask Verified, condition, trade/cash indicator
- "Message" (outline) + "Make Offer" (yellow, filled) buttons
- Description text (expandable)
- `SellerCard`
- "Safe Meetup Location" section with map thumbnail
- "Message" → navigate to chat; "Make Offer" → navigate to `app/make-offer/[id]`

### Make Offer (`app/make-offer/[id].tsx`)
- Back button + "Make Offer" title
- Item summary card (image, "Buying from X", title, price)
- "Your Cash Offer" input (numeric)
- "Propose a Trade" toggle → horizontal scroll of `TradeItemCard`
- Info tip: "Trading items can help lower the cash offer needed"
- "Message to Seller" multiline text input
- "Send Offer" yellow button

### Messages List (`message.tsx`)
- "Messages" header
- List of `ConversationItem` rows
- Tapping a row → navigate to `app/chat/[id]`

### Chat (`app/chat/[id].tsx`)
- Back + user name + "Verified Student" + info icon header
- Trade banner: item thumbnail, "Agreed on trade?", "Accept Trade" button
- Safe meetup location suggestion banner
- Date separator + `ChatBubble` list
- `QuickActionChip` row: Campus Spot, Set Time, Payment Method
- Message input + emoji + send button

### My Items (`myItems.tsx`)
- "My Listings" header + "Add New" button
- Filter chips: Active / Sold / Trade
- 2-column grid of `ListingCard`

### Profile (`profile.tsx`)
- Avatar, name, "Verified Student" badge, rating, year/faculty
- Stats row: Listings, Trades, Reviews
- "Edit Profile" button
- Recent Reviews list

---

## Execution Order

1. `types/index.ts` — shared types
2. `services/api.ts` — API client
3. Components (listing → home → profile → chat → offer)
4. Tab screens (index, message, myItems, profile)
5. New screens (listing/[id], make-offer/[id], chat/[id])
6. Update tab layout active colors

---

## Key Files
- `themes/theme.ts` — colors, spacing, typography
- `constants/theme.ts` — tab active/inactive colors
- `app/(tabs)/_layout.tsx` — tab bar config
