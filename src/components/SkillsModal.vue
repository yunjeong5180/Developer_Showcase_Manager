<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h2>🛠️ 기술 스택 선택</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <!-- 선택된 기술 표시 -->
      <div class="selected-section">
        <h3>선택된 기술 ({{ selectedSkills.length }}/20)</h3>
        <div class="selected-skills">
          <span 
            v-for="skill in selectedSkills" 
            :key="skill"
            class="selected-skill-tag"
          >
            {{ getSkillEmoji(skill) }} {{ skill }}
            <button @click="removeSkill(skill)" class="remove-selected">×</button>
          </span>
          <span v-if="selectedSkills.length === 0" class="empty-message">
            선택된 기술이 없습니다
          </span>
        </div>
      </div>

      <!-- 카테고리 탭 -->
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.key"
          @click="activeCategory = category.key"
          :class="['tab-btn', { active: activeCategory === category.key }]"
        >
          {{ category.icon }} {{ category.label }}
        </button>
      </div>

      <!-- 기술 목록 -->
      <div class="skills-grid-container">
        <div class="skills-grid">
          <button
            v-for="skill in currentCategorySkills"
            :key="skill.name"
            @click="toggleSkill(skill.name)"
            :class="['skill-item', { 
              selected: selectedSkills.includes(skill.name),
              disabled: !selectedSkills.includes(skill.name) && selectedSkills.length >= 20
            }]"
          >
            <span class="skill-emoji">{{ skill.emoji }}</span>
            <span class="skill-name">{{ skill.name }}</span>
            <span v-if="selectedSkills.includes(skill.name)" class="check-mark">✓</span>
          </button>
        </div>
      </div>

      <!-- 모달 푸터 -->
      <div class="modal-footer">
        <button @click="saveSkills" class="save-btn">
          💾 저장 ({{ selectedSkills.length }}개)
        </button>
        <button @click="closeModal" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillsModal',
  props: {
    initialSkills: {
      type: Array,
      default: () => []
    }
  },
  emits: ['save', 'close'],
  data() {
    return {
      activeCategory: 'frontend',
      selectedSkills: [...this.initialSkills],
      categories: [
        { key: 'frontend', label: 'Frontend', icon: '🎨' },
        { key: 'backend', label: 'Backend', icon: '⚙️' },
        { key: 'database', label: 'Database', icon: '🗄️' },
        { key: 'devops', label: 'DevOps', icon: '🚀' },
        { key: 'mobile', label: 'Mobile', icon: '📱' },
        { key: 'other', label: 'Other', icon: '🔧' }
      ],
      skillsData: {
        frontend: [
          { name: 'Vue.js', emoji: '💚' },
          { name: 'React', emoji: '⚛️' },
          { name: 'Angular', emoji: '🅰️' },
          { name: 'Svelte', emoji: '🔥' },
          { name: 'Next.js', emoji: '▲' },
          { name: 'Nuxt.js', emoji: '💚' },
          { name: 'JavaScript', emoji: '🟨' },
          { name: 'TypeScript', emoji: '🔷' },
          { name: 'HTML5', emoji: '🧡' },
          { name: 'CSS3', emoji: '💙' },
          { name: 'Sass', emoji: '💗' },
          { name: 'Less', emoji: '🔵' },
          { name: 'Tailwind CSS', emoji: '🌊' },
          { name: 'Bootstrap', emoji: '🅱️' },
          { name: 'Material-UI', emoji: '🎨' },
          { name: 'Ant Design', emoji: '🐜' },
          { name: 'jQuery', emoji: '💛' },
          { name: 'Alpine.js', emoji: '🏔️' },
          { name: 'Stimulus', emoji: '⚡' },
          { name: 'Ember.js', emoji: '🔥' }
        ],
        backend: [
          { name: 'Node.js', emoji: '💚' },
          { name: 'Express.js', emoji: '🚂' },
          { name: 'NestJS', emoji: '🐱' },
          { name: 'Fastify', emoji: '⚡' },
          { name: 'Koa.js', emoji: '🥥' },
          { name: 'Python', emoji: '🐍' },
          { name: 'Django', emoji: '🎸' },
          { name: 'FastAPI', emoji: '🚀' },
          { name: 'Flask', emoji: '🌶️' },
          { name: 'Tornado', emoji: '🌪️' },
          { name: 'Java', emoji: '☕' },
          { name: 'Spring Boot', emoji: '🍃' },
          { name: 'Spring MVC', emoji: '🍃' },
          { name: 'Hibernate', emoji: '💤' },
          { name: 'C#', emoji: '🔷' },
          { name: '.NET Core', emoji: '🌐' },
          { name: '.NET Framework', emoji: '🌐' },
          { name: 'ASP.NET', emoji: '🌐' },
          { name: 'PHP', emoji: '🐘' },
          { name: 'Laravel', emoji: '🎭' },
          { name: 'Symfony', emoji: '🎼' },
          { name: 'CodeIgniter', emoji: '🔥' },
          { name: 'Ruby', emoji: '💎' },
          { name: 'Ruby on Rails', emoji: '🚄' },
          { name: 'Sinatra', emoji: '🎤' },
          { name: 'Go', emoji: '🐹' },
          { name: 'Gin', emoji: '🍸' },
          { name: 'Echo', emoji: '📢' },
          { name: 'Rust', emoji: '🦀' },
          { name: 'Actix', emoji: '🎭' }
        ],
        database: [
          { name: 'MySQL', emoji: '🐬' },
          { name: 'PostgreSQL', emoji: '🐘' },
          { name: 'SQLite', emoji: '🪶' },
          { name: 'MariaDB', emoji: '🌊' },
          { name: 'MongoDB', emoji: '🍃' },
          { name: 'Redis', emoji: '🔴' },
          { name: 'Cassandra', emoji: '💍' },
          { name: 'CouchDB', emoji: '🛋️' },
          { name: 'Oracle', emoji: '🔮' },
          { name: 'MS SQL Server', emoji: '🔷' },
          { name: 'DynamoDB', emoji: '⚡' },
          { name: 'Elasticsearch', emoji: '🔍' },
          { name: 'Neo4j', emoji: '🕸️' },
          { name: 'InfluxDB', emoji: '📈' }
        ],
        devops: [
          { name: 'Docker', emoji: '🐳' },
          { name: 'Kubernetes', emoji: '☸️' },
          { name: 'Docker Compose', emoji: '🐙' },
          { name: 'AWS', emoji: '☁️' },
          { name: 'Azure', emoji: '☁️' },
          { name: 'Google Cloud', emoji: '☁️' },
          { name: 'Heroku', emoji: '💜' },
          { name: 'Vercel', emoji: '▲' },
          { name: 'Jenkins', emoji: '👨‍🔧' },
          { name: 'GitLab CI/CD', emoji: '🦊' },
          { name: 'GitHub Actions', emoji: '🤖' },
          { name: 'CircleCI', emoji: '⭕' },
          { name: 'Terraform', emoji: '🏗️' },
          { name: 'Ansible', emoji: '🔴' },
          { name: 'Chef', emoji: '👨‍🍳' },
          { name: 'Puppet', emoji: '🎭' },
          { name: 'Nginx', emoji: '🌐' },
          { name: 'Apache', emoji: '🪶' },
          { name: 'Git', emoji: '🌿' },
          { name: 'SVN', emoji: '📁' }
        ],
        mobile: [
          { name: 'React Native', emoji: '📱' },
          { name: 'Flutter', emoji: '🦋' },
          { name: 'Ionic', emoji: '⚡' },
          { name: 'Cordova', emoji: '📱' },
          { name: 'Swift', emoji: '🍎' },
          { name: 'Objective-C', emoji: '🍎' },
          { name: 'Kotlin', emoji: '🤖' },
          { name: 'Java Android', emoji: '🤖' },
          { name: 'Xamarin', emoji: '🔷' },
          { name: 'Unity', emoji: '🎮' },
          { name: 'Unreal Engine', emoji: '🎮' }
        ],
        other: [
          { name: 'GraphQL', emoji: '📊' },
          { name: 'REST API', emoji: '🌐' },
          { name: 'WebSockets', emoji: '🔌' },
          { name: 'gRPC', emoji: '📡' },
          { name: 'Webpack', emoji: '📦' },
          { name: 'Vite', emoji: '⚡' },
          { name: 'Rollup', emoji: '📦' },
          { name: 'Parcel', emoji: '📦' },
          { name: 'Babel', emoji: '🔄' },
          { name: 'ESLint', emoji: '🔍' },
          { name: 'Prettier', emoji: '💅' },
          { name: 'Jest', emoji: '🃏' },
          { name: 'Mocha', emoji: '☕' },
          { name: 'Cypress', emoji: '🌲' },
          { name: 'Selenium', emoji: '🤖' },
          { name: 'Figma', emoji: '🎨' },
          { name: 'Adobe XD', emoji: '🎨' },
          { name: 'Sketch', emoji: '✏️' },
          { name: 'Photoshop', emoji: '🖼️' },
          { name: 'Machine Learning', emoji: '🤖' },
          { name: 'TensorFlow', emoji: '🧠' },
          { name: 'PyTorch', emoji: '🔥' }
        ]
      }
    }
  },
  computed: {
    currentCategorySkills() {
      return this.skillsData[this.activeCategory] || []
    }
  },
  methods: {
    toggleSkill(skill) {
      if (this.selectedSkills.includes(skill)) {
        this.removeSkill(skill)
      } else if (this.selectedSkills.length < 20) {
        this.selectedSkills.push(skill)
      }
    },
    
    removeSkill(skill) {
      const index = this.selectedSkills.indexOf(skill)
      if (index > -1) {
        this.selectedSkills.splice(index, 1)
      }
    },
    
    getSkillEmoji(skillName) {
      // 모든 카테고리에서 해당 기술의 이모티콘 찾기
      for (const category in this.skillsData) {
        const skill = this.skillsData[category].find(s => s.name === skillName)
        if (skill) {
          return skill.emoji
        }
      }
      return '🔧' // 기본 이모티콘
    },
    
    saveSkills() {
      this.$emit('save', [...this.selectedSkills])
      this.closeModal()
    },
    
    closeModal() {
      this.$emit('close')
    }
  },
  
  mounted() {
    // ESC 키로 모달 닫기
    this.handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal()
      }
    }
    
    document.addEventListener('keydown', this.handleEscape)
  },
  
  beforeUnmount() {
    // 컴포넌트 제거 시 이벤트 리스너 정리
    if (this.handleEscape) {
      document.removeEventListener('keydown', this.handleEscape)
    }
  }
}
</script>

<style scoped>
/* 모달 오버레이 */
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
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 모달 컨테이너 */
.modal-container {
  background: white;
  border-radius: 16px;
  width: 90vw;
  max-width: 800px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 모달 헤더 */
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f3f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafbfc;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

/* 선택된 기술 섹션 */
.selected-section {
  padding: 16px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #f1f3f4;
}

.selected-section h3 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.selected-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 36px;
  align-items: center;
}

.selected-skill-tag {
  background: #42b883;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: slideInTag 0.2s ease-out;
}

@keyframes slideInTag {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.remove-selected {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.remove-selected:hover {
  background: rgba(255, 255, 255, 0.5);
}

.empty-message {
  color: #adb5bd;
  font-style: italic;
  font-size: 0.9rem;
}

/* 카테고리 탭 */
.category-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #f1f3f4;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.tab-btn.active {
  color: #42b883;
  border-bottom-color: #42b883;
  background: #f8fffc;
}

/* 기술 목록 그리드 */
.skills-grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.skill-item {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  transition: all 0.2s ease;
  position: relative;
  text-align: center;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.skill-emoji {
  font-size: 1.2rem;
  line-height: 1;
}

.skill-name {
  font-size: 0.8rem;
  line-height: 1.2;
}

.skill-item:hover:not(.disabled) {
  border-color: #42b883;
  background: #f8fffc;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.15);
}

.skill-item.selected {
  border-color: #42b883;
  background: #42b883;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.skill-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.check-mark {
  font-size: 0.8rem;
  font-weight: bold;
}

/* 모달 푸터 */
.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f1f3f4;
  background: #fafbfc;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.save-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background: #369870;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* 반응형 */
@media (max-width: 768px) {
  .modal-container {
    width: 95vw;
    max-height: 90vh;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
  
  .skill-item {
    padding: 10px 12px;
    font-size: 0.85rem;
    min-height: 40px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .save-btn, .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h2 {
    font-size: 1.3rem;
  }
  
  .skills-grid-container {
    padding: 16px;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>