<template>
  <div class="not-found">
    <div class="container">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">Page Not Found</h2>
      <p class="error-description">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <router-link to="/" class="back-home-btn">
        Go to Homepage
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  text-align: center;
  color: white;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.error-message {
  font-size: 2rem;
  margin: 1rem 0;
}

.error-description {
  font-size: 1.1rem;
  margin: 2rem 0;
  opacity: 0.9;
}

.back-home-btn {
  display: inline-block;
  padding: 12px 30px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-top: 1rem;
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>