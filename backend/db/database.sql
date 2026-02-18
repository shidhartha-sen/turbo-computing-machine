CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  profile_image_url text NOT NULL,
  items_sold integer NOT NULL DEFAULT 0,
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_available boolean NOT NULL DEFAULT true,
  CONSTRAINT fk_listings_seller
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  image_url text NOT NULL,
  CONSTRAINT fk_listing_images_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_conversations_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);
