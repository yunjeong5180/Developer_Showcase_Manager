-- projects 테이블에 category 컬럼 추가
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other';

-- 기존 프로젝트들의 category 업데이트 (필요한 경우)
UPDATE projects 
SET category = 'other' 
WHERE category IS NULL;

-- category 컬럼에 체크 제약 조건 추가 (선택사항)
ALTER TABLE projects 
ADD CONSTRAINT category_check 
CHECK (category IN ('web', 'mobile', 'desktop', 'ai', 'game', 'other'));

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_projects_category 
ON projects(category);

-- 확인
SELECT 
  id, 
  title, 
  category 
FROM projects 
LIMIT 10;