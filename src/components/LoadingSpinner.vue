<template>
  <div class="loading-container" :class="{ 'loading-overlay': overlay }">
    <div class="loading-content">
      <div class="loading-spinner" :class="size"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: '데이터를 불러오는 중...'
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    overlay: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9998;
  padding: 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.loading-spinner.medium {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.loading-spinner.large {
  width: 60px;
  height: 60px;
  border-width: 6px;
}

.loading-message {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .loading-container {
    padding: 40px 20px;
  }
  
  .loading-content {
    gap: 15px;
  }
  
  .loading-spinner.large {
    width: 50px;
    height: 50px;
    border-width: 5px;
  }
  
  .loading-message {
    font-size: 0.9rem;
  }
}
</style>