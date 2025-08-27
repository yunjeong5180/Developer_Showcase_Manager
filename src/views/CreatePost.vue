<template>
  <div class="admin-page create-post">
    <div class="admin-container">
      <!-- 페이지 헤더 -->
      <div class="page-header fade-in">
        <h1>{{ isEditMode ? "프로젝트 수정" : "새 프로젝트 작성" }}</h1>
      </div>

      <!-- 프로젝트 작성 폼 -->
      <div class="card">
        <form @submit.prevent="handleSubmit">
          <!-- 기본 정보 섹션 -->
          <div class="section">
            <h3 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </span>
              기본 정보
            </h3>

            <div class="form-group">
              <label for="title">프로젝트 제목 *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="예: 포트폴리오 웹사이트"
                required
                :class="{ error: errors.title }"
              />
              <span v-if="errors.title" class="error-message">{{
                errors.title
              }}</span>
            </div>

            <div class="form-group">
              <label for="description">프로젝트 설명 *</label>
              <textarea
                id="description"
                v-model="form.description"
                placeholder="프로젝트에 대한 상세한 설명을 작성하세요"
                rows="5"
                required
                :class="{ error: errors.description }"
              ></textarea>
              <span v-if="errors.description" class="error-message">{{
                errors.description
              }}</span>
              <span class="form-text"
                >{{ form.description.length }}/1000자</span
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate">시작일</label>
                <input id="startDate" v-model="form.startDate" type="date" />
              </div>
              <div class="form-group">
                <label for="endDate">종료일</label>
                <input id="endDate" v-model="form.endDate" type="date" />
              </div>
            </div>
          </div>

          <!-- 기술 스택 섹션 -->
          <div class="section">
            <h3 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </span>
              기술 스택
            </h3>

            <div class="form-group">
              <div class="tech-header">
                <label>사용된 기술</label>
                <button
                  type="button"
                  @click="showTechModal = true"
                  class="btn-select-tech"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  선택
                </button>
              </div>
              <div class="tech-container">
                <div v-if="form.technologies.length === 0" class="tech-empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  <p>아직 선택된 기술 스택이 없습니다</p>
                  <span>위의 선택 버튼을 눌러 기술을 추가해보세요</span>
                </div>
                <div v-else class="tech-grid-display">
                  <div
                    v-for="(tech, index) in form.technologies"
                    :key="index"
                    class="tech-item-card"
                  >
                    <span class="tech-name">{{ tech }}</span>
                    <button
                      type="button"
                      @click="removeTech(index)"
                      class="tech-remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 링크 섹션 -->
          <div class="section">
            <h3 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </span>
              관련 링크
            </h3>

            <div class="form-group">
              <label for="githubUrl">GitHub 저장소</label>
              <input
                id="githubUrl"
                v-model="form.githubUrl"
                type="url"
                placeholder="https://github.com/username/repository"
                :class="{ error: errors.githubUrl }"
              />
              <span v-if="errors.githubUrl" class="error-message">{{
                errors.githubUrl
              }}</span>
            </div>

            <div class="form-group">
              <label for="liveUrl">라이브 URL</label>
              <input
                id="liveUrl"
                v-model="form.liveUrl"
                type="url"
                placeholder="https://example.com"
                :class="{ error: errors.liveUrl }"
              />
              <span v-if="errors.liveUrl" class="error-message">{{
                errors.liveUrl
              }}</span>
            </div>
          </div>

          <!-- 이미지 업로드 섹션 -->
          <div class="section">
            <h3 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </span>
              프로젝트 이미지
            </h3>

            <div class="form-group">
              <label>스크린샷 업로드</label>
              <div class="image-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                  id="imageUpload"
                />
                <label for="imageUpload" class="upload-label">
                  <div class="upload-content">
                    <span class="upload-icon">📁</span>
                    <span class="upload-text">클릭하여 이미지 선택</span>
                    <span class="upload-hint">또는 파일을 드래그 앤 드롭</span>
                  </div>
                </label>
              </div>

              <!-- 이미지 미리보기 -->
              <div
                v-if="imagePreviewUrls.length > 0"
                class="image-preview-grid"
              >
                <div
                  v-for="(url, index) in imagePreviewUrls"
                  :key="index"
                  class="image-preview"
                >
                  <img :src="url" :alt="`Preview ${index + 1}`" />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 추가 정보 섹션 -->
          <div class="section">
            <h3 class="section-title">📌 추가 정보</h3>

            <div class="form-group">
              <label for="category">카테고리</label>
              <select id="category" v-model="form.category">
                <option value="">선택하세요</option>
                <option value="web">웹 개발</option>
                <option value="mobile">모바일 앱</option>
                <option value="desktop">데스크톱 앱</option>
                <option value="ai">AI/머신러닝</option>
                <option value="game">게임</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" v-model="form.isFeatured" />
                주요 프로젝트로 설정
              </label>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="form-actions">
            <button type="button" @click="handleCancel" class="btn btn-outline">
              취소
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? "저장 중..."
                  : isEditMode
                  ? "수정하기"
                  : "작성하기"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 기술 스택 선택 모달 -->
    <div v-if="showTechModal" class="modal-overlay" @click.self="showTechModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>기술 스택 선택</h2>
          <button @click="showTechModal = false" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- 카테고리 탭 -->
          <div class="tech-categories">
            <button
              v-for="category in Object.keys(availableTechs)"
              :key="category"
              @click="selectedCategory = category"
              :class="['category-tab', { active: selectedCategory === category }]"
            >
              {{ category }}
            </button>
          </div>
          
          <!-- 기술 목록 -->
          <div class="tech-grid">
            <button
              v-for="tech in availableTechs[selectedCategory]"
              :key="tech"
              @click="toggleTech(tech)"
              :class="['tech-item', { selected: form.technologies.includes(tech) }]"
            >
              <span v-if="form.technologies.includes(tech)" class="check-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
              {{ tech }}
            </button>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="selected-count">
            선택된 기술: {{ form.technologies.length }}개
          </div>
          <button @click="showTechModal = false" class="btn btn-primary">
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectService } from "@/shared/services";
import { imageService } from "@/shared/services";

export default {
  name: "CreatePost",
  data() {
    return {
      isEditMode: false,
      projectId: null,
      form: {
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        category: "",
        isFeatured: false,
      },
      imageFiles: [],
      imagePreviewUrls: [],
      existingImages: [],
      errors: {},
      isSubmitting: false,
      showTechModal: false,
      availableTechs: {
        '프론트엔드': [
          'HTML', 'CSS', 'JavaScript', 'TypeScript', 
          'React', 'Vue.js', 'Angular', 'Svelte',
          'Next.js', 'Nuxt.js', 'Gatsby', 'Remix',
          'Redux', 'MobX', 'Zustand', 'Recoil',
          'Sass/SCSS', 'Tailwind CSS', 'Styled Components', 'Emotion'
        ],
        '백엔드': [
          'Node.js', 'Express.js', 'NestJS', 'Fastify',
          'Python', 'Django', 'FastAPI', 'Flask',
          'Java', 'Spring', 'Spring Boot',
          'Ruby', 'Ruby on Rails',
          'PHP', 'Laravel', 'Symfony',
          'Go', 'Gin', 'Echo',
          'C#', '.NET Core', 'ASP.NET'
        ],
        '데이터베이스': [
          'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
          'SQLite', 'MariaDB', 'Oracle', 'SQL Server',
          'Elasticsearch', 'DynamoDB', 'Cassandra', 'Neo4j'
        ],
        '모바일': [
          'React Native', 'Flutter', 'Swift', 'SwiftUI',
          'Kotlin', 'Android', 'iOS', 'Ionic'
        ],
        'DevOps & 클라우드': [
          'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions',
          'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify',
          'Heroku', 'DigitalOcean', 'Nginx', 'Apache'
        ],
        '기타': [
          'Git', 'GraphQL', 'REST API', 'WebSocket',
          'Jest', 'Cypress', 'Webpack', 'Vite',
          'Figma', 'Adobe XD', 'Sketch'
        ]
      },
      selectedCategory: '프론트엔드'
    };
  },
  async mounted() {
    // 수정 모드 확인
    if (this.$route.params.id) {
      this.isEditMode = true;
      this.projectId = this.$route.params.id;
      await this.loadProject();
    }
  },
  methods: {
    async loadProject() {
      try {
        const result = await projectService.getProject(this.projectId);
        if (result.success) {
          const project = result.data;
          this.form = {
            title: project.title || "",
            description: project.description || "",
            startDate: project.start_date || "",
            endDate: project.end_date || "",
            technologies: project.technologies || [],
            githubUrl: project.github_url || "",
            liveUrl: project.live_url || "",
            category: project.category || "",
            isFeatured: project.is_featured || false,
          };
          this.existingImages = project.images || [];
          this.imagePreviewUrls = [...this.existingImages];
        }
      } catch (error) {
        console.error("프로젝트 로드 실패:", error);
        this.$router.push("/admin/post-list");
      }
    },

    toggleTech(tech) {
      const index = this.form.technologies.indexOf(tech);
      if (index > -1) {
        this.form.technologies.splice(index, 1);
      } else {
        this.form.technologies.push(tech);
      }
    },

    removeTech(index) {
      this.form.technologies.splice(index, 1);
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          this.imageFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreviewUrls.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    },

    removeImage(index) {
      if (index < this.existingImages.length) {
        this.existingImages.splice(index, 1);
      } else {
        const fileIndex = index - this.existingImages.length;
        this.imageFiles.splice(fileIndex, 1);
      }
      this.imagePreviewUrls.splice(index, 1);
    },

    validateForm() {
      this.errors = {};

      if (!this.form.title.trim()) {
        this.errors.title = "프로젝트 제목을 입력해주세요";
      }

      if (!this.form.description.trim()) {
        this.errors.description = "프로젝트 설명을 입력해주세요";
      }

      if (this.form.description.length > 1000) {
        this.errors.description = "설명은 1000자를 초과할 수 없습니다";
      }

      // URL 검증
      if (this.form.githubUrl && !this.isValidUrl(this.form.githubUrl)) {
        this.errors.githubUrl = "올바른 URL 형식을 입력해주세요";
      }

      if (this.form.liveUrl && !this.isValidUrl(this.form.liveUrl)) {
        this.errors.liveUrl = "올바른 URL 형식을 입력해주세요";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        // 프로젝트 데이터 준비
        const projectData = {
          title: this.form.title.trim(),
          description: this.form.description.trim(),
          start_date: this.form.startDate || null,
          end_date: this.form.endDate || null,
          tech_stack: this.form.technologies,
          github_url: this.form.githubUrl || null,
          demo_url: this.form.liveUrl || null,
          category: this.form.category || null,
          is_featured: this.form.isFeatured,
        };

        let result;
        if (this.isEditMode) {
          result = await projectService.updateProject(this.projectId, projectData);
        } else {
          result = await projectService.createProject(projectData);
        }

        if (result.success) {
          const projectId = result.data.id || this.projectId;

          // 이미지 업로드
          if (this.imageFiles.length > 0) {
            await imageService.uploadProjectImages(this.imageFiles, projectId);
          }

          // 성공 메시지 및 리다이렉트
          this.$router.push("/admin/post-list");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("프로젝트 저장 실패:", error);
        alert("프로젝트 저장 중 오류가 발생했습니다");
      } finally {
        this.isSubmitting = false;
      }
    },

    handleCancel() {
      if (confirm("작성 중인 내용이 사라집니다. 계속하시겠습니까?")) {
        this.$router.push("/admin/post-list");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;

// 관리자 페이지 공통 스타일
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px 20px;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
  
  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
  }
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.create-post {
  .section {
    margin-bottom: 48px;
    padding: 28px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.05);

    &-title {
      font-size: 1.25rem;
      color: #1a1a2e;
      margin-bottom: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      
      .section-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }

  .form-group {
    margin-bottom: 24px;
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #495057;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    input[type="text"],
    input[type="url"],
    input[type="date"],
    textarea,
    select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      &::placeholder {
        color: #adb5bd;
      }
      
      &.error {
        border-color: #dc3545;
        
        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 120px;
      font-family: inherit;
    }
    
    .error-message {
      display: block;
      margin-top: 6px;
      color: #dc3545;
      font-size: 0.875rem;
    }
    
    .form-text {
      display: block;
      margin-top: 6px;
      color: #6c757d;
      font-size: 0.875rem;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
    }
  }

  .tech-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .btn-select-tech {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: transparent;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
      }
    }
  }
  
  .tech-container {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 12px;
    padding: 20px;
    min-height: 120px;
    
    .tech-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
      color: #8b92a8;
      
      svg {
        margin-bottom: 12px;
        color: #c3cfe2;
      }
      
      p {
        margin: 0 0 4px 0;
        font-size: 0.95rem;
        font-weight: 500;
      }
      
      span {
        font-size: 0.85rem;
        color: #adb5bd;
      }
    }
    
    .tech-grid-display {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      
      .tech-item-card {
        background: white;
        border: 1px solid rgba(102, 126, 234, 0.2);
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
          
          .tech-remove {
            opacity: 1;
          }
        }
        
        .tech-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #495057;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tech-remove {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.6;
          transition: all 0.3s ease;
          flex-shrink: 0;
          
          &:hover {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      }
    }
  }

  .image-upload-area {
    .file-input {
      display: none;
    }

    .upload-label {
      display: block;
      border: 2px dashed rgba(102, 126, 234, 0.3);
      border-radius: 16px;
      padding: 48px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        
        &::before {
          opacity: 1;
        }

        .upload-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }

      .upload-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .upload-icon {
          font-size: 3rem;
          transition: transform 0.3s ease;
        }

        .upload-text {
          color: #212529;
          font-weight: 600;
        }

        .upload-hint {
          color: #6c757d;
          font-size: 0.9rem;
        }
      }
    }
  }

  .image-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 20px;

    .image-preview {
      position: relative;
      border-radius: $border-radius-lg;
      overflow: hidden;
      box-shadow: $shadow-sm;

      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
      }

      .remove-image-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;

        &:hover {
          background: $danger-color;
        }
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    
    .btn {
      padding: 12px 28px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      
      &.btn-outline {
        background: rgba(255, 255, 255, 0.9);
        color: #495057;
        border: 1px solid rgba(0, 0, 0, 0.1);
        
        &:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
      }
      
      &.btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
}

// 모달 스타일
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #2c3e50;
  }
  
  .modal-close {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.tech-categories {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  .category-tab {
    padding: 10px 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #f8f9fa;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e9ecef;
    }
    
    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    }
  }
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  
  .tech-item {
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
      border-color: #667eea;
      background: #f8f9fa;
    }
    
    &.selected {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
      
      .check-icon {
        display: flex;
      }
    }
    
    .check-icon {
      display: none;
      align-items: center;
      justify-content: center;
    }
  }
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .selected-count {
    color: #6c757d;
    font-weight: 500;
  }
  
  .btn {
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    
    &.btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      }
    }
  }
}
</style>
