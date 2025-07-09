import { supabase } from '@/services/supabaseClient.js'

// 회원가입 함수
export async function signUp(userData) {
  try {
    // 1. Supabase Auth로 인증 계정 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });

    if (authError) throw authError;

    // 2. users 테이블에 추가 정보 저장
    const { data: userRecord, error: insertError } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        profile_image_url: userData.profile_image_url || null,
        one_liner: userData.one_liner || null,
        bio: userData.bio || null,
        github_url: userData.github_url || null,
        linkedin_url: userData.linkedin_url || null,
        personal_blog_url: userData.personal_blog_url || null
      }])
      .select();

    if (insertError) throw insertError;

    return {
      success: true,
      auth: authData,
      user: userRecord[0]
    };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, error: error.message };
  }
}

// 로그인 함수
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    // 추가 사용자 정보 가져오기
    const userInfo = await getUserByEmail(email);

    return {
      success: true,
      auth: data,
      user: userInfo.success ? userInfo.user : null
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, error: error.message };
  }
}

// 로그아웃 함수
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { success: false, error: error.message };
  }
}

// 사용자 정보 조회
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return { success: true, user: data };
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return { success: false, error: error.message };
  }
}

// 사용자 정보 업데이트
export async function updateUser(id, updateData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, user: data[0] };
  } catch (error) {
    console.error('사용자 업데이트 오류:', error);
    return { success: false, error: error.message };
  }
}
