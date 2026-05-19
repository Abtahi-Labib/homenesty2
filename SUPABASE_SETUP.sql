-- HomeNesty Supabase Schema Setup

-- 1. Create Profiles Table (Linked to Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Properties Table
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  rent INTEGER NOT NULL,
  rooms INTEGER NOT NULL,
  category TEXT DEFAULT 'family' CHECK (category IN ('family', 'student', 'bachelor', 'hotel', 'job-holder')),
  image_url TEXT,
  map_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 4. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profiles" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profiles" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Properties Policies
CREATE POLICY "Approved properties are viewable by everyone" 
ON public.properties FOR SELECT USING (status = 'approved');

CREATE POLICY "Owners can view their own properties" 
ON public.properties FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view everything" 
ON public.properties FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Landlords can insert properties" 
ON public.properties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('landlord', 'admin'))
);

CREATE POLICY "Owners can update their own properties" 
ON public.properties FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can update everything" 
ON public.properties FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Owners can delete their own properties" 
ON public.properties FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can delete everything" 
ON public.properties FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Create Bookings Table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT
);

-- 8. Create Favorites Table (Cart)
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, property_id)
);

-- Enable RLS for new tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Bookings Policies
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Property owners can view bookings for their properties" 
ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
);

CREATE POLICY "Users can create bookings" 
ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- 6. Trigger for New User Profile (Optional but recommended)
-- Note: Alternatively, we do this in the code (which we already implemented in Register.tsx)
