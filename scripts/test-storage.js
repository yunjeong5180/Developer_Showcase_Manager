// Supabase Storage 테스트 및 버킷 생성 시도
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gjuwbcfuadlwvxrxbgui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXdiY2Z1YWRsd3Z4cnhiZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDUxMzYsImV4cCI6MjA2NjIyMTEzNn0.VxjQtPM47TSijZbXK4htyoVavODwOa7gdyrSwLc1-7s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  console.log('🔍 Storage 상태 확인 중...\n');
  
  try {
    // 1. 버킷 목록 조회 시도
    console.log('1. 버킷 목록 조회 시도...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ 버킷 목록 조회 실패:', listError.message);
      console.log('\n⚠️  서비스 역할 키가 필요할 수 있습니다.');
    } else {
      console.log('✅ 현재 버킷 목록:');
      if (buckets && buckets.length > 0) {
        buckets.forEach(bucket => {
          console.log(`   - ${bucket.name} (${bucket.public ? '공개' : '비공개'})`);
        });
      } else {
        console.log('   (버킷이 없습니다)');
      }
    }
    
    // 2. project-images 버킷에 테스트 파일 업로드 시도
    console.log('\n2. project-images 버킷 테스트...');
    
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const fileName = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, testFile);
    
    if (uploadError) {
      if (uploadError.message.includes('Bucket not found')) {
        console.error('❌ project-images 버킷이 존재하지 않습니다.');
        console.log('\n📝 해결 방법:');
        console.log('1. Supabase 대시보드 (https://supabase.com/dashboard) 접속');
        console.log('2. 프로젝트 선택');
        console.log('3. Storage 메뉴 클릭');
        console.log('4. "New bucket" 클릭');
        console.log('5. 이름: project-images');
        console.log('6. Public bucket 체크');
        console.log('7. Create 클릭');
      } else {
        console.error('❌ 업로드 실패:', uploadError.message);
      }
    } else {
      console.log('✅ 테스트 파일 업로드 성공!');
      console.log('   파일 경로:', uploadData.path);
      
      // 테스트 파일 삭제
      const { error: deleteError } = await supabase.storage
        .from('project-images')
        .remove([fileName]);
      
      if (!deleteError) {
        console.log('   (테스트 파일 삭제 완료)');
      }
    }
    
    // 3. 다른 버킷들 확인
    console.log('\n3. 다른 Storage 버킷 확인...');
    const bucketNames = ['profile-images', 'avatars', 'public'];
    
    for (const bucketName of bucketNames) {
      const { error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1 });
      
      if (!error) {
        console.log(`✅ ${bucketName} 버킷 존재`);
      }
    }
    
  } catch (err) {
    console.error('예외 발생:', err);
  }
}

console.log('Supabase URL:', 'https://gjuwbcfuadlwvxrxbgui.supabase.co');
console.log('=====================================\n');

testStorage();