# 📚 Composition API 가이드

## Options API vs Composition API 비교

### 🔵 Options API (기존 방식)
```javascript
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('컴포넌트 마운트됨')
  }
}
```

### 🟢 Composition API (새로운 방식)
```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // 반응형 데이터
    const count = ref(0)
    const message = ref('Hello')
    
    // 계산된 속성
    const doubleCount = computed(() => count.value * 2)
    
    // 메서드
    const increment = () => {
      count.value++
    }
    
    // 라이프사이클
    onMounted(() => {
      console.log('컴포넌트 마운트됨')
    })
    
    // 템플릿에서 사용할 항목 반환
    return {
      count,
      message,
      doubleCount,
      increment
    }
  }
}
```

## 🎯 Composition API 핵심 개념

### 1. **ref** - 단일 값 반응형 데이터
```javascript
import { ref } from 'vue'

const count = ref(0)        // 숫자
const name = ref('John')    // 문자열
const isActive = ref(false) // 불린

// 값 접근 및 변경 (.value 사용)
console.log(count.value)    // 0
count.value++               // 1
```

### 2. **reactive** - 객체 반응형 데이터
```javascript
import { reactive } from 'vue'

const state = reactive({
  user: {
    name: 'John',
    age: 30
  },
  todos: []
})

// 직접 접근 가능 (.value 불필요)
state.user.name = 'Jane'
state.todos.push({ id: 1, text: 'Learn Vue' })
```

### 3. **computed** - 계산된 속성
```javascript
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(2)

// 자동으로 재계산됨
const total = computed(() => price.value * quantity.value)
```

### 4. **watch** - 데이터 감시
```javascript
import { ref, watch } from 'vue'

const searchQuery = ref('')

// searchQuery 변경 감시
watch(searchQuery, (newValue, oldValue) => {
  console.log(`검색어 변경: ${oldValue} → ${newValue}`)
  // API 호출 등
})
```

### 5. **라이프사이클 훅**
```javascript
import { onMounted, onUnmounted, onUpdated } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('컴포넌트 마운트')
      // DOM 접근 가능
    })
    
    onUpdated(() => {
      console.log('컴포넌트 업데이트')
    })
    
    onUnmounted(() => {
      console.log('컴포넌트 언마운트')
      // 정리 작업
    })
  }
}
```

## 💡 실전 예제

### 1. 카운터 컴포넌트
```vue
<template>
  <div>
    <p>카운트: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">리셋</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const increment = () => count.value++
    const decrement = () => count.value--
    const reset = () => count.value = 0
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
</script>
```

### 2. 할 일 목록 컴포넌트
```vue
<template>
  <div>
    <input v-model="newTodo" @keyup.enter="addTodo">
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.text }}
        <button @click="removeTodo(todo.id)">삭제</button>
      </li>
    </ul>
    <p>완료되지 않은 할 일: {{ pendingCount }}개</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const newTodo = ref('')
    const todos = ref([])
    const nextId = ref(1)
    
    const pendingCount = computed(() => 
      todos.value.filter(todo => !todo.done).length
    )
    
    const addTodo = () => {
      if (newTodo.value.trim()) {
        todos.value.push({
          id: nextId.value++,
          text: newTodo.value,
          done: false
        })
        newTodo.value = ''
      }
    }
    
    const removeTodo = (id) => {
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index > -1) {
        todos.value.splice(index, 1)
      }
    }
    
    return {
      newTodo,
      todos,
      pendingCount,
      addTodo,
      removeTodo
    }
  }
}
</script>
```

### 3. API 호출 예제
```vue
<template>
  <div>
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">에러: {{ error }}</div>
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.name }}
      </div>
    </div>
    <button @click="fetchUsers">사용자 목록 새로고침</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    const fetchUsers = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch('/api/users')
        users.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    // 컴포넌트 마운트 시 자동으로 데이터 로드
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      users,
      loading,
      error,
      fetchUsers
    }
  }
}
</script>
```

## 🔄 기존 컴포넌트 마이그레이션 전략

### 단계적 접근
1. **새 컴포넌트는 Composition API로 작성**
2. **기존 컴포넌트는 필요 시에만 마이그레이션**
3. **복잡한 로직이 있는 컴포넌트부터 우선 변경**

### 마이그레이션 체크리스트
- [ ] `data()` → `ref()` 또는 `reactive()`
- [ ] `computed` → `computed()`
- [ ] `methods` → 일반 함수
- [ ] `watch` → `watch()` 또는 `watchEffect()`
- [ ] 라이프사이클 훅 → `onMounted()`, `onUnmounted()` 등
- [ ] `this` 제거 (setup에서는 this 사용 불가)

## 🎨 Composition API의 장점

### 1. **로직 재사용성**
```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return {
    count,
    increment,
    decrement
  }
}

// 컴포넌트에서 사용
import { useCounter } from '@/composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement } = useCounter(10)
    return { count, increment, decrement }
  }
}
```

### 2. **더 나은 타입 추론**
- TypeScript와 더 잘 통합됨
- IDE 자동완성이 더 정확함

### 3. **코드 구조화**
- 관련 로직을 함께 그룹화
- 큰 컴포넌트를 더 잘 관리

## ⚠️ 주의사항

### 1. **setup() 내에서 this 사용 불가**
```javascript
// ❌ 잘못된 예
setup() {
  this.count = 0  // 에러!
}

// ✅ 올바른 예
setup() {
  const count = ref(0)
  return { count }
}
```

### 2. **ref 값 접근 시 .value 필요**
```javascript
// ❌ 잘못된 예
const count = ref(0)
count++  // 동작하지 않음

// ✅ 올바른 예
count.value++
```

### 3. **반응성 유지**
```javascript
// ❌ 반응성 손실
const state = reactive({ count: 0 })
let { count } = state  // count는 반응형이 아님

// ✅ 반응성 유지
const state = reactive({ count: 0 })
const { count } = toRefs(state)  // count는 ref로 변환됨
```

## 📝 정리

- **Options API도 계속 지원됩니다** - 서두를 필요 없음
- **점진적 마이그레이션 가능** - 한 번에 모두 바꿀 필요 없음
- **필요한 곳부터 적용** - 복잡한 로직이 있는 컴포넌트부터

Composition API는 **선택사항**입니다. 기존 Options API가 더 편하다면 계속 사용해도 됩니다! 🚀