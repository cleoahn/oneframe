-- 기본 읽기 권한 (anon 역할)
GRANT SELECT ON users TO anon;
GRANT SELECT ON documents TO anon;
GRANT SELECT ON assessments TO anon;
GRANT SELECT ON stage_progress TO anon;

-- 전체 권한 (authenticated 역할)
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON documents TO authenticated;
GRANT ALL PRIVILEGES ON assessments TO authenticated;
GRANT ALL PRIVILEGES ON stage_progress TO authenticated;

-- 사용자 테이블 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 원고 테이블 RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);

-- 판정 테이블 RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);

-- Stage 진행 테이블 RLS
ALTER TABLE stage_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON stage_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON stage_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create progress" ON stage_progress FOR INSERT WITH CHECK (auth.uid() = user_id);