import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = 'https://gjuwbcfuadlwvxrxbgui.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // 서비스 키가 필요합니다

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY 환경 변수가 필요합니다.');
  console.log('다음 명령어로 실행하세요:');
  console.log('SUPABASE_SERVICE_KEY=your-service-key node scripts/create-storage-bucket.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createProjectImagesBucket() {
  try {
    // 버킷 생성
    const { data, error } = await supabase.storage.createBucket('project-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ project-images 버킷이 이미 존재합니다.');
      } else {
        console.error('❌ 버킷 생성 실패:', error);
      }
    } else {
      console.log('✅ project-images 버킷이 성공적으로 생성되었습니다!');
      console.log('버킷 정보:', data);
    }

    // 버킷 목록 확인
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (!listError) {
      console.log('\n📦 현재 Storage 버킷 목록:');
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? '공개' : '비공개'})`);
      });
    }

  } catch (err) {
    console.error('예외 발생:', err);
  }
}

createProjectImagesBucket();