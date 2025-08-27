<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 양윤정. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
// Import 가이드라인:
// - Supabase: import { supabase } from '@/shared/services'
// - 컴포넌트: import ComponentName from '@/modules/portfolio/components/ComponentName.vue'
// - Router: import router from '@/router/index-unified'
// - Store: import store from '@/store/index-unified'

export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 2rem 0;
}

.footer p {
  margin: 0;
}
</style>
