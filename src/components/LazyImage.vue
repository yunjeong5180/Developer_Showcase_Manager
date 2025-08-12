<template>
  <div ref="imageContainer" class="lazy-image-container">
    <img
      v-if="isLoaded"
      :src="src"
      :alt="alt"
      class="lazy-image"
      :class="{ 'loaded': isImageLoaded }"
      @load="onImageLoad"
      @error="onImageError"
    />
    <div v-else class="lazy-image-placeholder">
      <div class="skeleton-loader"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    threshold: {
      type: Number,
      default: 0.1
    }
  },
  setup(props) {
    const imageContainer = ref(null)
    const isLoaded = ref(false)
    const isImageLoaded = ref(false)
    let observer = null

    const loadImage = () => {
      isLoaded.value = true
    }

    const onImageLoad = () => {
      isImageLoaded.value = true
    }

    const onImageError = (event) => {
      // 에러 발생시 기본 이미지로 대체
      event.target.src = '/placeholder-image.jpg'
    }

    onMounted(() => {
      // Intersection Observer 설정
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                loadImage()
                observer.unobserve(entry.target)
              }
            })
          },
          {
            threshold: props.threshold,
            rootMargin: '50px'
          }
        )

        if (imageContainer.value) {
          observer.observe(imageContainer.value)
        }
      } else {
        // Intersection Observer를 지원하지 않는 브라우저는 즉시 로드
        loadImage()
      }
    })

    onUnmounted(() => {
      if (observer && imageContainer.value) {
        observer.unobserve(imageContainer.value)
      }
    })

    return {
      imageContainer,
      isLoaded,
      isImageLoaded,
      onImageLoad,
      onImageError
    }
  }
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image.loaded {
  opacity: 1;
}

.lazy-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>