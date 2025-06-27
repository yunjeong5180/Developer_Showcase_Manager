<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2>비밀번호 찾기 테스트</h2>
      <p>이 페이지가 보이면 라우팅은 정상입니다.</p>

      <form @submit.prevent="handleSubmit">
        <input
          type="email"
          v-model="email"
          placeholder="이메일을 입력하세요"
          required
        />
        <button type="submit">테스트 버튼</button>
      </form>

      <router-link to="/login">로그인으로 돌아가기</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    handleSubmit() {
      console.log('테스트 폼 제출:', this.email)
      alert('테스트 성공!')
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background: #667eea;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

a {
  display: block;
  margin-top: 20px;
  color: #667eea;
  text-decoration: none;
}
</style>