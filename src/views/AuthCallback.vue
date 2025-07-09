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

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="handleModalCancel">
      <div class="modal-content" @click.stop>
        <h3>{{ modalTitle }}</h3>
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons">
          <button @click="handleModalConfirm" class="modal-btn-primary">확인</button>
          <button @click="handleModalCancel" class="modal-btn-secondary">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase, authAPI } from '@/config/supabase'

export default {
  name: 'AuthCallback',
  data() {
    return {
      error: null,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalRedirectTo: null
    }
  },
  async mounted() {
    try {
      console.log('AuthCallback 시작')
      console.log('전체 URL:', window.location.href)
      console.log('해시:', window.location.hash)

      // URL 해시에서 파라미터 추출
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')
      const error = hashParams.get('error')
      const errorCode = hashParams.get('error_code')

      console.log('URL 파라미터:', { 
        type, 
        hasToken: !!accessToken,
        error,
        errorCode 
      })

      // 에러가 있는 경우 처리
      if (error) {
        console.error('AuthCallback 에러:', error, errorCode)
        let errorMessage = `인증 오류: ${error}`
        if (errorCode === 'otp_expired') {
          errorMessage = '비밀번호 재설정 링크가 만료되었습니다. 새로운 링크를 요청해주세요.'
        }
        this.showErrorModal('인증 오류', errorMessage, '/forgot-password')
        return
      }

      // 비밀번호 재설정 타입이면 즉시 리다이렉트 (세션 확인 없이)
      if (type === 'recovery' && accessToken) {
        console.log('비밀번호 재설정 타입 감지, 즉시 /reset-password로 리다이렉트')
        // replace를 사용하여 히스토리를 남기지 않고 이동
        this.$router.replace({
          path: '/reset-password',
          hash: window.location.hash
        })
        return
      }

      // 일반 OAuth 로그인인 경우에만 세션 확인
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('OAuth 콜백 오류:', sessionError)
        this.error = sessionError.message
        return
      }

      if (data.session) {
        console.log('OAuth 세션 확인됨:', data.session.user.email)

        // 🆕 소셜 로그인 사용자도 users 테이블에 마이그레이션
        await authAPI.ensureUserInUsersTable(data.session.user)

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
        this.showErrorModal('로그인 세션 오류', '로그인 세션을 찾을 수 없습니다. 로그인 페이지로 이동하시겠습니까?', '/login')
      }
    } catch (error) {
      console.error('OAuth 콜백 처리 예외:', error)
      this.showErrorModal('로그인 오류', '로그인 처리 중 오류가 발생했습니다. 로그인 페이지로 이동하시겠습니까?', '/login')
    }
  },
  methods: {
    showErrorModal(title, message, redirectTo) {
      this.modalTitle = title
      this.modalMessage = message
      this.modalRedirectTo = redirectTo
      this.showModal = true
      this.error = null
    },

    handleModalConfirm() {
      this.showModal = false
      if (this.modalRedirectTo) {
        this.$router.push(this.modalRedirectTo)
      }
    },

    handleModalCancel() {
      this.showModal = false
      this.modalRedirectTo = null
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

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.modal-content p {
  color: #6c757d;
  margin-bottom: 25px;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-btn-primary, .modal-btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.modal-btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.modal-btn-secondary:hover {
  background: #e9ecef;
  color: #495057;
}

/* 반응형 */
@media (max-width: 480px) {
  .callback-container {
    padding: 30px 20px;
  }

  .callback-container h2 {
    font-size: 1.3rem;
  }

  .modal-content {
    padding: 20px;
    margin: 0 10px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-btn-primary, .modal-btn-secondary {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>