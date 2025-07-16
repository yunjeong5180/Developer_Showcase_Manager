<template>
  <div v-if="message.text" class="toast-container" :class="message.type">
    <div class="toast-content">
      <div class="toast-icon">
        <span v-if="message.type === 'success'">✅</span>
        <span v-if="message.type === 'error'">❌</span>
        <span v-if="message.type === 'warning'">⚠️</span>
        <span v-if="message.type === 'info'">ℹ️</span>
      </div>
      <div class="toast-message">
        {{ message.text }}
      </div>
      <button @click="closeToast" class="toast-close">
        ✕
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToastMessage',
  props: {
    message: {
      type: Object,
      default: () => ({
        text: '',
        type: 'info'
      })
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  watch: {
    'message.text'(newText) {
      if (newText) {
        this.startTimer();
      }
    }
  },
  methods: {
    startTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      this.timer = setTimeout(() => {
        this.closeToast();
      }, this.duration);
    },
    closeToast() {
      this.$emit('close');
      if (this.timer) {
        clearTimeout(this.timer);
      }
    }
  },
  data() {
    return {
      timer: null
    };
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

/* Success Toast */
.toast-container.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.toast-container.success .toast-close {
  color: #155724;
}

.toast-container.success .toast-close:hover {
  background: rgba(21, 87, 36, 0.1);
}

/* Error Toast */
.toast-container.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.toast-container.error .toast-close {
  color: #721c24;
}

.toast-container.error .toast-close:hover {
  background: rgba(114, 28, 36, 0.1);
}

/* Warning Toast */
.toast-container.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.toast-container.warning .toast-close {
  color: #856404;
}

.toast-container.warning .toast-close:hover {
  background: rgba(133, 100, 4, 0.1);
}

/* Info Toast */
.toast-container.info {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.toast-container.info .toast-close {
  color: #0c5460;
}

.toast-container.info .toast-close:hover {
  background: rgba(12, 84, 96, 0.1);
}

/* 애니메이션 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .toast-container {
    left: 20px;
    right: 20px;
    min-width: auto;
    max-width: none;
  }
  
  .toast-content {
    padding: 12px;
  }
  
  .toast-message {
    font-size: 0.9rem;
  }
}
</style>