-- Allow authenticated users to create their own profile row
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

