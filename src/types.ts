export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'tenant' | 'landlord' | 'admin';
  created_at: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  rent: number;
  rooms: number;
  category: 'family' | 'student' | 'bachelor' | 'job-holder';
  image_url: string | null;
  map_link: string | null;
  status: 'pending' | 'approved' | 'rejected';
  owner_id: string;
  created_at: string;
};
