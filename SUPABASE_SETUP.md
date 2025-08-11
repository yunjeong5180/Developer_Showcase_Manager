# Supabase 설정 가이드

## 현재 상태
현재 프로젝트는 **로컬 모드**로 실행 중입니다. Supabase가 설정되지 않아도 기능을 테스트할 수 있습니다.

## Supabase 설정 방법 (선택사항)

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 웹사이트 방문
2. 무료 계정 생성 또는 로그인
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - Project name: `mycodit` (또는 원하는 이름)
   - Database Password: 안전한 비밀번호 설정
   - Region: 가장 가까운 지역 선택 (예: Northeast Asia - Seoul)

### 2. API 키 확인
1. 프로젝트 대시보드에서 Settings → API 메뉴 이동
2. 다음 정보 복사:
   - Project URL (`https://xxxxx.supabase.co`)
   - `anon` public 키

### 3. 환경 변수 설정
1. `.env.development` 파일 생성 (이미 있음)
2. 다음 내용으로 업데이트:
```env
VUE_APP_SUPABASE_URL=https://your-project.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 데이터베이스 테이블 생성
Supabase SQL Editor에서 다음 쿼리 실행:

```sql
-- users 테이블 생성
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) UNIQUE,
  profile_image_url TEXT,
  one_liner TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  personal_blog_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- projects 테이블 생성
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  start_date DATE,
  end_date DATE,
  is_ongoing BOOLEAN DEFAULT false,
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (읽기는 모두 허용, 쓰기는 본인만)
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid()::text = user_id::text);
```

### 5. Storage 버킷 생성 (이미지 업로드용)
1. Supabase 대시보드에서 Storage 메뉴 이동
2. "New Bucket" 클릭
3. 버킷 이름: `profile-images`
4. Public 버킷으로 설정

## 로컬 모드 vs Supabase 모드

### 로컬 모드 (현재)
- ✅ Supabase 설정 없이 즉시 사용 가능
- ✅ 모든 기능 테스트 가능
- ⚠️ 데이터는 브라우저 localStorage에만 저장
- ⚠️ 브라우저 데이터 삭제 시 모든 정보 손실

### Supabase 모드
- ✅ 실제 데이터베이스에 데이터 저장
- ✅ 여러 기기에서 동일한 데이터 접근
- ✅ 이미지 업로드 및 저장 지원
- ✅ 실시간 동기화 가능
- ⚠️ 초기 설정 필요

## 문제 해결

### "ERR_NAME_NOT_RESOLVED" 오류
- 원인: Supabase URL이 잘못 설정됨
- 해결: `.env.development` 파일의 URL 확인

### 로그인/회원가입이 작동하지 않음
- 원인: Supabase 미설정
- 해결: 로컬 모드로 자동 전환되므로 정상 작동해야 함

### 콘솔에 경고 메시지가 표시됨
- 정상적인 동작입니다
- Supabase 미설정 시 로컬 모드 안내 메시지

## 참고 사항
- 개발 초기에는 로컬 모드로 충분합니다
- 프로덕션 배포 시 Supabase 설정을 권장합니다
- 무료 플랜으로도 충분한 기능을 제공합니다