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
      console.log('AuthCallback 시작')

      // URL 해시에서 파라미터 추출
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')

      console.log('URL 파라미터:', { type, hasToken: !!accessToken })

      // 비밀번호 재설정 타입이면 즉시 리다이렉트 (세션 확인 없이)
      if (type === 'recovery' && accessToken) {
        console.log('비밀번호 재설정 타입 감지, 즉시 /reset-password로 리다이렉트')
        // URL 해시를 유지하면서 리다이렉트
        this.$router.push('/reset-password' + window.location.hash)
        return
      }

      // 일반 OAuth 로그인인 경우에만 세션 확인
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('OAuth 콜백 오류:', error)
        this.error = error.message
        return
      }

      if (data.session) {
        console.log('OAuth 세션 확인됨:', data.session.user.email)

        // 일반 소셜 로그인 처리
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
        console.log('사용자 정보 저장 완료, 대시보드로 이동')

        // 대시보드로 리디렉션
        this.$router.push('/dashboard')
      } else {
        console.log('세션이 없습니다. 로그인 페이지로 리디렉션합니다.')
        this.error = '로그인 세션을 찾을 수 없습니다.'
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
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
  font-size: 1.5rem;
}

.callback-container p {
  color: #666;
  margin-bottom: 20px;
  font-size: 1rem;
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
  font-size: 1.3rem;
}

.error-message p {
  color: #c33;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.retry-btn {
  background: #667eea;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s ease;
  font-weight: 600;
}

.retry-btn:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

/* 반응형 */
@media (max-width: 480px) {
  .callback-container {
    padding: 30px 20px;
  }

  .callback-container h2 {
    font-size: 1.3rem;
  }
}
</style>