# 📋 프로필 관리 기능 완성 작업 목록

## 🚨 1단계: 데이터베이스 설정 (필수 - 최우선)

### 현재 발생하는 오류
- **DB 오류**: `column users.title does not exist` - users 테이블에 필요한 컬럼들이 없음
- **Storage 오류**: `Bucket not found` - profile-images 버킷이 존재하지 않음

### 1-1. Supabase 데이터베이스 설정

#### users 테이블에 누락된 컬럼 추가
Supabase 대시보드의 SQL Editor에서 다음 쿼리 실행:

```sql
-- 기본 프로필 정보 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS one_liner TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- 프로필 이미지 URL
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 소셜 미디어 및 포트폴리오 링크
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blog_url TEXT;

-- 연락처 정보
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;

-- 기술 스택 (JSON 배열로 저장)
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
```

#### 컬럼 추가 확인 방법
```sql
-- users 테이블 구조 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### 1-2. Supabase Storage 설정

#### profile-images 버킷 생성
1. Supabase 대시보드 → Storage 섹션 이동
2. "New Bucket" 클릭
3. 버킷 설정:
   - Name: `profile-images`
   - Public bucket: ✅ 체크 (프로필 이미지는 공개)
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

#### 버킷 권한 정책 설정
SQL Editor에서 다음 RLS 정책 추가:

```sql
-- 인증된 사용자는 자신의 프로필 이미지 업로드 가능
CREATE POLICY "Users can upload own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 인증된 사용자는 자신의 프로필 이미지 수정 가능
CREATE POLICY "Users can update own profile images" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'profile-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 모든 사용자가 프로필 이미지 조회 가능
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');
```

---

## 🔧 2단계: 기본 기능 검증 및 수정

### 2-1. 프로필 데이터 로드 확인

#### src/config/supabase.js 수정사항
```javascript
// getUserProfile 함수 - 새 컬럼들 포함
const { data, error } = await supabase
  .from('users')
  .select(`
    id, 
    user_id,
    username,
    email,
    title,
    one_liner,
    bio,
    profile_image_url,
    github_url,
    linkedin_url,
    portfolio_url,
    blog_url,
    phone,
    location,
    skills,
    created_at,
    updated_at
  `)
  .eq('user_id', userId)
  .single();
```

#### Profile.vue에서 데이터 바인딩 확인
- 모든 새 필드가 v-model로 연결되어 있는지 확인
- 초기값 설정이 올바른지 검증

### 2-2. 프로필 정보 저장 확인

#### updateUserProfile 함수 수정
```javascript
// 저장할 데이터 객체에 모든 필드 포함
const updates = {
  user_id: userId,
  username: profileData.username,
  email: profileData.email,
  title: profileData.title,
  one_liner: profileData.one_liner,
  bio: profileData.bio,
  profile_image_url: profileData.profile_image_url,
  github_url: profileData.github_url,
  linkedin_url: profileData.linkedin_url,
  portfolio_url: profileData.portfolio_url,
  blog_url: profileData.blog_url,
  phone: profileData.phone,
  location: profileData.location,
  skills: profileData.skills,
  updated_at: new Date().toISOString()
};
```

### 2-3. 이미지 업로드 기능 확인

#### 업로드 프로세스
1. 파일 선택 시 미리보기 표시
2. 파일 유효성 검사 (크기, 형식)
3. Supabase Storage에 업로드
4. 공개 URL 획득 및 DB 저장

#### 이미지 업로드 함수 구현
```javascript
async uploadProfileImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) throw error;
  
  // 공개 URL 생성
  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
```

---

## 🎨 3단계: 기술 스택 모달 기능 구현

### 3-1. 모달 컴포넌트 생성

#### components/SkillsModal.vue 파일 생성
```vue
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>기술 스택 선택</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <div class="modal-body">
        <!-- 검색 입력 -->
        <input 
          v-model="searchQuery" 
          placeholder="기술 검색..."
          class="search-input"
        />
        
        <!-- 선택된 기술 표시 -->
        <div class="selected-skills">
          <h3>선택된 기술 ({{ selectedSkills.length }}/20)</h3>
          <div class="skill-chips">
            <span 
              v-for="skill in selectedSkills" 
              :key="skill"
              class="skill-chip"
            >
              {{ skill }}
              <button @click="removeSkill(skill)">×</button>
            </span>
          </div>
        </div>
        
        <!-- 카테고리별 기술 목록 -->
        <div class="skill-categories">
          <div 
            v-for="(skills, category) in filteredSkillsByCategory" 
            :key="category"
            class="category-section"
          >
            <h3>{{ category }}</h3>
            <div class="skills-grid">
              <label 
                v-for="skill in skills" 
                :key="skill"
                class="skill-checkbox"
              >
                <input 
                  type="checkbox"
                  :value="skill"
                  :checked="selectedSkills.includes(skill)"
                  @change="toggleSkill(skill)"
                  :disabled="!selectedSkills.includes(skill) && selectedSkills.length >= 20"
                />
                {{ skill }}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="saveSkills" class="save-btn">저장</button>
        <button @click="closeModal" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>
```

### 3-2. 기술 목록 데이터 준비

#### 기술 스택 데이터 구조
```javascript
const skillsData = {
  'Frontend': [
    'Vue.js', 'React', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
    'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'Less',
    'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design'
  ],
  'Backend': [
    'Node.js', 'Express.js', 'NestJS', 'Python', 'Django', 'FastAPI',
    'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel',
    'Ruby', 'Ruby on Rails', 'Go', 'Rust'
  ],
  'Database': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
    'Oracle', 'MS SQL Server', 'DynamoDB', 'Cassandra', 'Elasticsearch'
  ],
  'DevOps': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'CircleCI',
    'Terraform', 'Ansible', 'Git'
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic',
    'Xamarin', 'Native Android', 'Native iOS'
  ],
  'Other': [
    'GraphQL', 'REST API', 'WebSockets', 'gRPC',
    'Webpack', 'Vite', 'Babel', 'Jest', 'Mocha', 'Cypress',
    'Figma', 'Adobe XD', 'Sketch'
  ]
};
```

### 3-3. 기술 선택 로직 구현

#### 주요 기능 메서드
```javascript
methods: {
  // 기술 토글 (선택/해제)
  toggleSkill(skill) {
    if (this.selectedSkills.includes(skill)) {
      this.removeSkill(skill);
    } else if (this.selectedSkills.length < 20) {
      this.selectedSkills.push(skill);
    } else {
      this.$toast.warning('최대 20개까지만 선택 가능합니다.');
    }
  },
  
  // 기술 제거
  removeSkill(skill) {
    const index = this.selectedSkills.indexOf(skill);
    if (index > -1) {
      this.selectedSkills.splice(index, 1);
    }
  },
  
  // 검색 필터링
  get filteredSkillsByCategory() {
    const filtered = {};
    const query = this.searchQuery.toLowerCase();
    
    for (const [category, skills] of Object.entries(this.skillsData)) {
      const filteredSkills = skills.filter(skill => 
        skill.toLowerCase().includes(query)
      );
      
      if (filteredSkills.length > 0) {
        filtered[category] = filteredSkills;
      }
    }
    
    return filtered;
  },
  
  // 저장
  saveSkills() {
    this.$emit('save', this.selectedSkills);
    this.closeModal();
  }
}
```

### 3-4. Profile.vue와 연동

#### 모달 열기 버튼 추가
```vue
<!-- Profile.vue의 기술 스택 섹션 -->
<div class="form-group">
  <label>기술 스택</label>
  <button @click="openSkillsModal" class="edit-skills-btn">
    기술 스택 편집 ({{ profile.skills.length }}개 선택됨)
  </button>
  <div class="current-skills">
    <span v-for="skill in profile.skills" :key="skill" class="skill-tag">
      {{ skill }}
    </span>
  </div>
</div>

<!-- 모달 컴포넌트 -->
<SkillsModal 
  v-if="showSkillsModal"
  :initial-skills="profile.skills"
  @save="updateSkills"
  @close="showSkillsModal = false"
/>
```

---

## 📋 4단계: 최종 통합 테스트

### 4-1. 전체 프로필 관리 기능 테스트 체크리스트

#### 기본 정보 입력
- [ ] 이름(title) 입력 및 저장
- [ ] 한 줄 소개(one_liner) 입력 및 저장
- [ ] 자기소개(bio) 입력 및 저장
- [ ] 전화번호 형식 검증
- [ ] 위치 정보 입력

#### 프로필 이미지
- [ ] 이미지 선택 시 미리보기
- [ ] 5MB 이하 파일만 업로드 허용
- [ ] 지원 형식(jpg, png, webp, gif)만 허용
- [ ] 업로드 진행률 표시
- [ ] 업로드 완료 후 즉시 표시

#### URL 검증
- [ ] GitHub URL 형식 검증 (https://github.com/...)
- [ ] LinkedIn URL 형식 검증 (https://linkedin.com/in/...)
- [ ] 포트폴리오/블로그 URL 형식 검증
- [ ] 잘못된 URL 입력 시 에러 메시지

#### 기술 스택 모달
- [ ] 모달 열기/닫기 애니메이션
- [ ] ESC 키로 모달 닫기
- [ ] 오버레이 클릭으로 모달 닫기
- [ ] 검색 기능 정상 작동
- [ ] 20개 제한 확인
- [ ] 선택된 기술 실시간 카운트

### 4-2. 에러 처리 및 사용자 경험

#### 에러 시나리오 테스트
```javascript
// 네트워크 오류 처리
try {
  await updateProfile();
} catch (error) {
  if (error.message.includes('network')) {
    this.$toast.error('네트워크 연결을 확인해주세요.');
  } else {
    this.$toast.error('프로필 저장 중 오류가 발생했습니다.');
  }
}
```

#### 로딩 상태 표시
- [ ] 프로필 로드 중 스켈레톤 UI
- [ ] 저장 중 버튼 비활성화 및 로딩 표시
- [ ] 이미지 업로드 중 프로그레스 바

#### 성공 피드백
- [ ] 저장 성공 시 토스트 메시지
- [ ] 필드 변경 시 저장 버튼 활성화
- [ ] 저장 후 변경사항 즉시 반영

### 4-3. 성능 최적화

#### 이미지 최적화
- [ ] 업로드 전 이미지 리사이징 (최대 1024x1024)
- [ ] 이미지 압축 적용
- [ ] 썸네일 생성 및 캐싱

#### 데이터 최적화
- [ ] 디바운싱 적용 (입력 필드)
- [ ] 불필요한 API 호출 방지
- [ ] 로컬 스토리지 캐싱

---

## 🛠️ 문제 해결 가이드

### 일반적인 오류와 해결 방법

#### 1. "column does not exist" 오류
- 원인: DB에 필요한 컬럼이 없음
- 해결: 1단계의 ALTER TABLE 쿼리 실행

#### 2. "Bucket not found" 오류
- 원인: Storage 버킷이 생성되지 않음
- 해결: Supabase 대시보드에서 profile-images 버킷 생성

#### 3. "Permission denied" 오류
- 원인: RLS 정책이 설정되지 않음
- 해결: Storage 권한 정책 SQL 실행

#### 4. 이미지 업로드 실패
- 원인: 파일 크기 초과 또는 형식 오류
- 해결: 클라이언트 측 검증 강화

---

## 📁 관련 파일 목록

### 수정이 필요한 파일
- `src/config/supabase.js` - DB 쿼리 및 Storage 함수
- `src/views/Profile.vue` - 프로필 관리 UI 및 로직
- `src/components/SkillsModal.vue` - 기술 스택 선택 모달 (새로 생성)
- `src/assets/css/profile.css` - 프로필 페이지 스타일

### 참고할 파일
- `src/router/index.js` - 라우팅 설정
- `src/store/index.js` - Vuex 상태 관리
- `.env` - 환경 변수 설정

---

## ⚡ 작업 우선순위

1. **긴급**: DB 및 Storage 설정 (현재 앱이 작동하지 않음)
2. **높음**: 기본 기능 복구 및 테스트
3. **중간**: 기술 스택 모달 구현
4. **낮음**: 성능 최적화 및 UX 개선

---

*작성일: 2025-01-14*
*최종 수정일: 2025-01-15*
*상태: 진행 중*
*담당자: @yunjeong5180*