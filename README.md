# Registration Form App

A responsive registration form built with React and Vite, using Supabase as the backend.

## Features

- Registration form with Name, Email, WhatsApp Mobile, and Time Slot selection
- 10 time slots with a maximum of 13 registrations per slot
- Real-time slot availability updates
- Fully responsive design
- Slots automatically hidden when full

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key to `.env`

3. **Create Supabase table:**
   Run this SQL in your Supabase SQL Editor:
   ```sql
   CREATE TABLE registrations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     whatsapp_mobile TEXT NOT NULL UNIQUE,
     time_slot TEXT NOT NULL CHECK (time_slot IN ('Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_time_slot ON registrations(time_slot);
   CREATE UNIQUE INDEX idx_unique_whatsapp ON registrations(whatsapp_mobile);
   ```

4. **Enable Row Level Security (RLS):**
   ```sql
   ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Enable insert for all users" ON registrations
     FOR INSERT WITH CHECK (true);

   CREATE POLICY "Enable read for all users" ON registrations
     FOR SELECT USING (true);
   ```

5. **Optional - Add slot limit constraint:**
   Create a function to enforce the 13-person limit:
   ```sql
   CREATE OR REPLACE FUNCTION check_slot_capacity()
   RETURNS TRIGGER AS $$
   BEGIN
     IF (SELECT COUNT(*) FROM registrations WHERE time_slot = NEW.time_slot) >= 13 THEN
       RAISE EXCEPTION 'This slot is full';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER enforce_slot_capacity
     BEFORE INSERT ON registrations
     FOR EACH ROW
     EXECUTE FUNCTION check_slot_capacity();
   ```

## Development

```bash
npm run dev
```

## Production

1. Update `.env` with production Supabase credentials
2. Build the app:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your hosting service

## Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
