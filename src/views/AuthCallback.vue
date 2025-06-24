<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <h2>로그인 처리 중...</h2>
      <p>잠시만 기다려주세요. 로그인을 완료하고 있습니다.</p>

      <div v-if="error" class="error-message">
        <h3>로그인 실패</h3>
        <p>{{ error }}</p>
        <router-link to="/login" class="retry-btn">로그인 페이지로 돌아가기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

export default {
  name: 'AuthCallback',
  data() {
    return {
      error: null
    }
  },
  async mounted() {
    try {
      // URL 해시에서 세션 정보 추출 및 처리
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('OAuth 콜백 오류:', error)
        this.error = error.message
        return
      }

      if (data.session) {
        console.log('OAuth 로그인 성공:', data.session.user.email)

        // 사용자 정보 저장
        const userData = {
          email: data.session.user.email,
          name: data.session.user.user_metadata?.full_name ||
            data.session.user.user_metadata?.name ||
            data.session.user.email?.split('@')[0],
          id: data.session.user.id,
          provider: data.session.user.app_metadata?.provider || 'unknown',
          avatar_url: data.session.user.user_metadata?.avatar_url
        }

        localStorage.setItem('user', JSON.stringify(userData))

        // 대시보드로 리디렉션
        this.$router.push('/dashboard')
      } else {
        console.log('세션이 없습니다. 로그인 페이지로 리디렉션합니다.')
        this.$router.push('/login')
      }
    } catch (error) {
      console.error('OAuth 콜백 처리 예외:', error)
      this.error = '로그인 처리 중 오류가 발생했습니다.'
    }
  }
}
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-container {
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.callback-container h2 {
  color: #333;
  margin-bottom: 10px;
}

.callback-container p {
  color: #666;
  margin-bottom: 20px;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.error-message h3 {
  color: #c33;
  margin-bottom: 10px;
}

.error-message p {
  color: #c33;
  margin-bottom: 15px;
}

.retry-btn {
  background: #667eea;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #5a6fd8;
}
</style>