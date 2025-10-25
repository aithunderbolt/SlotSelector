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

3. **Create Supabase tables:**
   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- Registrations table
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

   -- Users table for admin authentication
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('super_admin', 'slot_admin')),
     assigned_slot TEXT CHECK (assigned_slot IN ('Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE UNIQUE INDEX idx_unique_username ON users(username);

   -- Insert sample admin users
   INSERT INTO users (username, password, role, assigned_slot) VALUES
   ('superadmin', 'admin123', 'super_admin', NULL),
   ('slot1admin', 'slot1pass', 'slot_admin', 'Slot 1'),
   ('slot2admin', 'slot2pass', 'slot_admin', 'Slot 2'),
   ('slot3admin', 'slot3pass', 'slot_admin', 'Slot 3'),
   ('slot4admin', 'slot4pass', 'slot_admin', 'Slot 4'),
   ('slot5admin', 'slot5pass', 'slot_admin', 'Slot 5'),
   ('slot6admin', 'slot6pass', 'slot_admin', 'Slot 6'),
   ('slot7admin', 'slot7pass', 'slot_admin', 'Slot 7'),
   ('slot8admin', 'slot8pass', 'slot_admin', 'Slot 8'),
   ('slot9admin', 'slot9pass', 'slot_admin', 'Slot 9'),
   ('slot10admin', 'slot10pass', 'slot_admin', 'Slot 10');
   ```

4. **Enable Row Level Security (RLS):**
   ```sql
   -- Registrations table policies
   ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Enable insert for all users" ON registrations
     FOR INSERT WITH CHECK (true);

   CREATE POLICY "Enable read for all users" ON registrations
     FOR SELECT USING (true);

   -- Users table policies
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Enable read for all users" ON users
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

## Admin Dashboard

Access the admin dashboard at `/admin` route. Two types of admin access:

**Super Admin:**
- Username: `superadmin` / Password: `admin123`
- Can view all registrations across all slots
- Can filter and download data for any slot or all slots
- See statistics for all slots

**Slot Admins:**
- Username: `slot1admin` to `slot10admin` / Password: `slot1pass` to `slot10pass`
- Can only view registrations for their assigned slot
- Can download data for their slot only
- See statistics for their slot only

Features:
- Live registration data with real-time updates
- Role-based access control
- Excel export functionality
- Responsive design
