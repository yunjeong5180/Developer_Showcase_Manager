-- Supabase 데이터베이스 스키마 설정
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. users 테이블 생성 (사용자 프로필 정보)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) UNIQUE,
  title VARCHAR(200),
  one_liner TEXT,
  bio TEXT,
  profile_image_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  blog_url TEXT,
  phone VARCHAR(50),
  location VARCHAR(200),
  skills JSONB DEFAULT '[]'::jsonb,
  auth_user_id UUID UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. projects 테이블 생성 (포트폴리오 프로젝트)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'active', -- active, archived, draft
  start_date DATE,
  end_date DATE,
  display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. posts 테이블 생성 (블로그 포스트)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. experiences 테이블 생성 (경력 사항)
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(200),
  company_logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. educations 테이블 생성 (학력 사항)
CREATE TABLE IF NOT EXISTS educations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  field_of_study VARCHAR(255),
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(200),
  gpa VARCHAR(20),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. skills 테이블 생성 (기술 스택 마스터)
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100), -- frontend, backend, database, devops, etc.
  icon_url TEXT,
  color VARCHAR(7), -- HEX color code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. user_skills 테이블 생성 (사용자별 기술 스택)
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 5), -- 1-5 scale
  years_of_experience DECIMAL(3,1),
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- 8. certifications 테이블 생성 (자격증)
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. contact_messages 테이블 생성 (연락 메시지)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. statistics 테이블 생성 (통계 데이터)
CREATE TABLE IF NOT EXISTS statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  project_views INTEGER DEFAULT 0,
  post_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_educations_user_id ON educations(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_contact_messages_to_user_id ON contact_messages(to_user_id);
CREATE INDEX idx_statistics_user_id_date ON statistics(user_id, date);

-- Updated At 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 Updated At 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educations_updated_at BEFORE UPDATE ON educations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- RLS 정책: users 테이블
-- 모든 사용자가 프로필을 볼 수 있음
CREATE POLICY "Public profiles are viewable by everyone" ON users
  FOR SELECT USING (true);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 사용자는 자신의 프로필만 삽입 가능
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id OR auth_user_id IS NULL);

-- RLS 정책: projects 테이블
-- 모든 사용자가 프로젝트를 볼 수 있음
CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

-- 사용자는 자신의 프로젝트만 생성/수정/삭제 가능
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = projects.user_id AND users.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = projects.user_id AND users.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = projects.user_id AND users.auth_user_id = auth.uid()
  ));

-- RLS 정책: posts 테이블
-- 공개된 포스트는 모두가 볼 수 있음
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published' OR EXISTS (
    SELECT 1 FROM users WHERE users.id = posts.user_id AND users.auth_user_id = auth.uid()
  ));

-- 사용자는 자신의 포스트만 생성/수정/삭제 가능
CREATE POLICY "Users can manage own posts" ON posts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = posts.user_id AND users.auth_user_id = auth.uid()
  ));

-- RLS 정책: experiences, educations, certifications
-- 모두가 볼 수 있음
CREATE POLICY "Public experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public educations" ON educations FOR SELECT USING (true);
CREATE POLICY "Public certifications" ON certifications FOR SELECT USING (true);

-- 사용자는 자신의 것만 관리 가능
CREATE POLICY "Users manage own experiences" ON experiences
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = experiences.user_id AND users.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users manage own educations" ON educations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = educations.user_id AND users.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users manage own certifications" ON certifications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = certifications.user_id AND users.auth_user_id = auth.uid()
  ));

-- RLS 정책: skills (모두 읽기 가능)
CREATE POLICY "Skills are public" ON skills FOR SELECT USING (true);

-- RLS 정책: user_skills
CREATE POLICY "Public user skills" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users manage own skills" ON user_skills
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = user_skills.user_id AND users.auth_user_id = auth.uid()
  ));

-- RLS 정책: contact_messages
-- 메시지는 받는 사람만 볼 수 있음
CREATE POLICY "Users can view own messages" ON contact_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = contact_messages.to_user_id AND users.auth_user_id = auth.uid()
  ));

-- 누구나 메시지를 보낼 수 있음
CREATE POLICY "Anyone can send messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- RLS 정책: statistics
-- 사용자는 자신의 통계만 볼 수 있음
CREATE POLICY "Users can view own statistics" ON statistics
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = statistics.user_id AND users.auth_user_id = auth.uid()
  ));

-- 기본 기술 스택 데이터 삽입
INSERT INTO skills (name, category, color) VALUES
  -- Frontend
  ('HTML', 'frontend', '#E34C26'),
  ('CSS', 'frontend', '#1572B6'),
  ('JavaScript', 'frontend', '#F7DF1E'),
  ('TypeScript', 'frontend', '#3178C6'),
  ('React', 'frontend', '#61DAFB'),
  ('Vue.js', 'frontend', '#4FC08D'),
  ('Angular', 'frontend', '#DD0031'),
  ('Svelte', 'frontend', '#FF3E00'),
  ('Next.js', 'frontend', '#000000'),
  ('Nuxt.js', 'frontend', '#00DC82'),
  
  -- Backend
  ('Node.js', 'backend', '#339933'),
  ('Python', 'backend', '#3776AB'),
  ('Java', 'backend', '#007396'),
  ('Spring', 'backend', '#6DB33F'),
  ('Django', 'backend', '#092E20'),
  ('FastAPI', 'backend', '#009688'),
  ('Express.js', 'backend', '#000000'),
  ('NestJS', 'backend', '#E0234E'),
  ('Ruby on Rails', 'backend', '#CC0000'),
  ('PHP', 'backend', '#777BB4'),
  ('Laravel', 'backend', '#FF2D20'),
  ('Go', 'backend', '#00ADD8'),
  
  -- Database
  ('PostgreSQL', 'database', '#4169E1'),
  ('MySQL', 'database', '#4479A1'),
  ('MongoDB', 'database', '#47A248'),
  ('Redis', 'database', '#DC382D'),
  ('SQLite', 'database', '#003B57'),
  ('Oracle', 'database', '#F80000'),
  ('Supabase', 'database', '#3ECF8E'),
  ('Firebase', 'database', '#FFCA28'),
  
  -- DevOps
  ('Docker', 'devops', '#2496ED'),
  ('Kubernetes', 'devops', '#326CE5'),
  ('AWS', 'devops', '#FF9900'),
  ('Google Cloud', 'devops', '#4285F4'),
  ('Azure', 'devops', '#0078D4'),
  ('Jenkins', 'devops', '#D24939'),
  ('GitHub Actions', 'devops', '#2088FF'),
  ('Terraform', 'devops', '#7B42BC'),
  ('Ansible', 'devops', '#EE0000'),
  
  -- Tools
  ('Git', 'tools', '#F05032'),
  ('GitHub', 'tools', '#181717'),
  ('GitLab', 'tools', '#FCA121'),
  ('VS Code', 'tools', '#007ACC'),
  ('Figma', 'tools', '#F24E1E'),
  ('Postman', 'tools', '#FF6C37'),
  ('Jira', 'tools', '#0052CC')
ON CONFLICT (name) DO NOTHING;

-- Storage Buckets 생성을 위한 SQL (Supabase Dashboard에서 실행)
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('profile-images', 'profile-images', true),
--   ('project-images', 'project-images', true),
--   ('post-images', 'post-images', true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 완료 메시지
SELECT 'Database schema created successfully!' as message;