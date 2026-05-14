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

-- 6. Trigger for New User Profile (Optional but recommended)
-- Note: Alternatively, we do this in the code (which we already implemented in Register.tsx)
