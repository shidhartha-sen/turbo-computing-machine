CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  profile_image_url text NOT NULL,
  items_sold integer NOT NULL DEFAULT 0,
  CONSTRAINT users_email_unique UNIQUE (email)
);

