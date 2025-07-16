<template>
  <div class="create-post">
    <div class="page-header">
      <h1>✏️ 새 프로젝트 추가</h1>
      <p>포트폴리오에 새로운 프로젝트를 추가하세요</p>
      
      <!-- 임시 저장 상태 표시 -->
      <div v-if="isDraft" class="draft-status">
        💾 임시 저장됨 ({{ formatLastSaved() }})
      </div>
    </div>

    <!-- 공통 토스트 메시지 -->
    <ToastMessage :message="message" @close="clearMessage" />
    
    <!-- 공통 로딩 스피너 -->
    <LoadingSpinner v-if="loading" :message="loadingMessage" :overlay="true" />

    <!-- 진행률 바 -->
    <div v-if="showProgress" class="progress-container">
      <div class="progress-info">
        <span class="progress-text">{{ currentStep }}</span>
        <span class="progress-percentage">{{ uploadProgress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="project-form">
        <!-- 프로젝트 제목 -->
        <div class="form-group">
          <label for="title">프로젝트 제목 *</label>
          <input
            id="title"
            v-model="projectForm.title"
            type="text"
            placeholder="예: Todo List App"
            required
            @input="onFormChange"
            :class="{ 'error': errors.title }"
          />
          <div v-if="errors.title" class="field-error">{{ errors.title }}</div>
        </div>

        <!-- 프로젝트 설명 -->
        <div class="form-group">
          <label for="description">프로젝트 설명 *</label>
          <textarea
            id="description"
            v-model="projectForm.description"
            rows="4"
            placeholder="프로젝트에 대한 간단한 설명을 작성해주세요"
            required
            @input="onFormChange"
            :class="{ 'error': errors.description }"
          ></textarea>
          <div v-if="errors.description" class="field-error">{{ errors.description }}</div>
        </div>

        <!-- 배포 URL -->
        <div class="form-group">
          <label for="projectUrl">배포 URL</label>
          <input
            id="projectUrl"
            v-model="projectForm.projectUrl"
            type="url"
            placeholder="https://your-project.com"
            @input="onFormChange"
            :class="{ 'error': errors.projectUrl }"
          />
          <div v-if="errors.projectUrl" class="field-error">{{ errors.projectUrl }}</div>
        </div>

        <!-- GitHub URL -->
        <div class="form-group">
          <label for="githubUrl">GitHub 저장소 URL</label>
          <input
            id="githubUrl"
            v-model="projectForm.githubUrl"
            type="url"
            placeholder="https://github.com/username/repository"
            @input="onFormChange"
            :class="{ 'error': errors.githubUrl }"
          />
          <div v-if="errors.githubUrl" class="field-error">{{ errors.githubUrl }}</div>
        </div>

        <!-- 프로젝트 기간 -->
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">시작일 *</label>
            <input
              id="startDate"
              v-model="projectForm.startDate"
              type="date"
              required
              @change="onFormChange"
              :class="{ 'error': errors.startDate }"
            />
            <div v-if="errors.startDate" class="field-error">{{ errors.startDate }}</div>
          </div>
          <div class="form-group">
            <label for="endDate">종료일</label>
            <input
              id="endDate"
              v-model="projectForm.endDate"
              type="date"
              @change="onFormChange"
              :class="{ 'error': errors.endDate }"
            />
            <small>진행 중인 프로젝트는 비워두세요</small>
            <div v-if="errors.endDate" class="field-error">{{ errors.endDate }}</div>
          </div>
        </div>

        <!-- 대표 이미지 -->
        <div class="form-group">
          <label for="mainImage">대표 이미지</label>
          <div class="file-upload-area" :class="{ 'error': errors.mainImage }">
            <input
              id="mainImage"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
            />
            <div class="upload-placeholder">
              <span v-if="!projectForm.imagePreview">
                📷 이미지를 선택하거나 드래그해주세요 (최대 10MB)
              </span>
              <img
                v-else
                :src="projectForm.imagePreview"
                alt="미리보기"
                class="image-preview"
              />
            </div>
          </div>
          <div v-if="errors.mainImage" class="field-error">{{ errors.mainImage }}</div>
        </div>

        <!-- 기술 스택 -->
        <div class="form-group">
          <label>사용 기술 스택</label>
          <div class="tech-stack-input">
            <input
              v-model="newTech"
              type="text"
              placeholder="기술 이름을 입력하고 Enter 또는 + 버튼을 누르세요"
              @keyup.enter="addTechStack"
              :class="{ 'error': errors.techStack }"
            />
            <button type="button" @click="addTechStack" class="add-tech-btn">
              +
            </button>
          </div>
          <div v-if="errors.techStack" class="field-error">{{ errors.techStack }}</div>
          <div class="tech-stack-list">
            <span
              v-for="(tech, index) in projectForm.techStack"
              :key="index"
              class="tech-tag"
            >
              {{ tech }}
              <button
                type="button"
                @click="removeTechStack(index)"
                class="remove-tech"
              >
                ×
              </button>
            </span>
          </div>
          <small v-if="projectForm.techStack.length > 0">
            {{ projectForm.techStack.length }}/10 기술 스택 추가됨
          </small>
        </div>

        <!-- 제출 버튼 -->
        <div class="form-actions">
          <router-link to="/post-list" class="btn-cancel">취소</router-link>
          <button 
            type="button" 
            @click="saveDraft" 
            class="btn-draft"
            :disabled="isSubmitting"
          >
            💾 임시 저장
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">
              <span class="loading-spinner"></span>
              저장 중...
            </span>
            <span v-else>🚀 프로젝트 저장</span>
          </button>
        </div>
      </form>
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
import { projectAPI } from '@/services/projectService'
import { imageAPI } from '@/services/imageService'
import { messageMixin, loadingMixin } from "@/utils/messageUtils";
import ToastMessage from "@/components/ToastMessage.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "CreatePostPage",
  mixins: [messageMixin, loadingMixin],
  components: {
    ToastMessage,
    LoadingSpinner
  },
  data() {
    return {
      projectForm: {
        title: "",
        description: "",
        projectUrl: "",
        githubUrl: "",
        startDate: "",
        endDate: "",
        mainImage: null,
        imagePreview: null,
        techStack: [],
      },
      newTech: "",
      isSubmitting: false,
      
      // 진행률 및 로딩 상태
      uploadProgress: 0,
      currentStep: "",
      showProgress: false,
      
      // 에러 처리
      errors: {},
      
      // 모달 상태
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalRedirectTo: null,
      
      // 임시 저장
      isDraft: false,
      lastSaved: null
    };
  },
  mounted() {
    // 임시 저장된 데이터 로드
    this.loadDraftData();
  },

  beforeUnmount() {
    // 컴포넌트 종료 시 미리보기 URL 정리
    if (this.projectForm.imagePreview) {
      imageAPI.revokePreviewUrl(this.projectForm.imagePreview);
    }
  },

  methods: {
    // 이미지 업로드 처리
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        // 파일 유효성 검사
        const validationResult = this.validateImageFile(file);
        if (!validationResult.isValid) {
          this.setFieldError('mainImage', validationResult.error);
          return;
        }

        this.clearFieldError('mainImage');
        this.projectForm.mainImage = file;

        // 이미지 미리보기 생성
        this.projectForm.imagePreview = imageAPI.createPreviewUrl(file);

        // 자동 임시 저장
        this.saveDraft();

      } catch (error) {
        console.error('이미지 업로드 처리 오류:', error);
        this.setFieldError('mainImage', '이미지 처리 중 오류가 발생했습니다.');
      }
    },

    // 이미지 파일 유효성 검사
    validateImageFile(file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: 'JPG, PNG, WebP, GIF 형식의 이미지만 업로드 가능합니다.'
        };
      }

      if (file.size > maxSize) {
        return {
          isValid: false,
          error: '이미지 크기는 10MB 이하여야 합니다.'
        };
      }

      return { isValid: true };
    },

    // 기술 스택 추가
    addTechStack() {
      const tech = this.newTech.trim();
      if (!tech) {
        this.setFieldError('techStack', '기술 스택 이름을 입력해주세요.');
        return;
      }

      if (this.projectForm.techStack.includes(tech)) {
        this.setFieldError('techStack', '이미 추가된 기술 스택입니다.');
        return;
      }

      if (this.projectForm.techStack.length >= 10) {
        this.setFieldError('techStack', '기술 스택은 최대 10개까지 추가할 수 있습니다.');
        return;
      }

      this.clearFieldError('techStack');
      this.projectForm.techStack.push(tech);
      this.newTech = "";
      this.saveDraft();
    },

    // 기술 스택 제거
    removeTechStack(index) {
      this.projectForm.techStack.splice(index, 1);
      this.saveDraft();
    },

    // 폼 검증 강화
    validateForm() {
      this.errors = {};
      this.globalError = null;

      // 필수 필드 검사
      if (!this.projectForm.title.trim()) {
        this.setFieldError('title', '프로젝트 제목을 입력해주세요.');
      } else if (this.projectForm.title.length > 100) {
        this.setFieldError('title', '프로젝트 제목은 100자 이하로 입력해주세요.');
      }

      if (!this.projectForm.description.trim()) {
        this.setFieldError('description', '프로젝트 설명을 입력해주세요.');
      } else if (this.projectForm.description.length > 1000) {
        this.setFieldError('description', '프로젝트 설명은 1000자 이하로 입력해주세요.');
      }

      if (!this.projectForm.startDate) {
        this.setFieldError('startDate', '프로젝트 시작일을 입력해주세요.');
      }

      // URL 유효성 검사
      if (this.projectForm.projectUrl && !this.isValidUrl(this.projectForm.projectUrl)) {
        this.setFieldError('projectUrl', '유효한 프로젝트 URL을 입력해주세요.');
      }

      if (this.projectForm.githubUrl && !this.isValidUrl(this.projectForm.githubUrl)) {
        this.setFieldError('githubUrl', '유효한 GitHub URL을 입력해주세요.');
      }

      // 날짜 유효성 검사
      if (this.projectForm.startDate && this.projectForm.endDate) {
        if (new Date(this.projectForm.startDate) > new Date(this.projectForm.endDate)) {
          this.setFieldError('endDate', '종료일은 시작일보다 늦어야 합니다.');
        }
      }

      return Object.keys(this.errors).length === 0;
    },

    // URL 유효성 검사
    isValidUrl(url) {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch (e) {
        return false;
      }
    },

    // 프로젝트 제출
    async handleSubmit() {
      if (!this.validateForm()) {
        this.showErrorMessage('입력한 정보를 다시 확인해주세요.');
        return;
      }

      this.isSubmitting = true;
      this.showProgress = true;
      this.uploadProgress = 0;
      this.startLoading('프로젝트 생성 중...');

      try {
        this.currentStep = "프로젝트 생성 중...";
        this.uploadProgress = 20;

        // 1. 프로젝트 데이터 준비
        const projectData = {
          title: this.projectForm.title.trim(),
          description: this.projectForm.description.trim(),
          demo_url: this.projectForm.projectUrl?.trim() || null,
          github_url: this.projectForm.githubUrl?.trim() || null,
          start_date: this.projectForm.startDate || null,
          end_date: this.projectForm.endDate || null,
          tech_stack: this.projectForm.techStack,
          image_urls: []
        };

        // 2. 프로젝트 생성
        const projectResult = await projectAPI.createProject(projectData);
        if (!projectResult.success) {
          throw new Error(projectResult.error || '프로젝트 생성에 실패했습니다.');
        }

        this.uploadProgress = 50;
        const newProject = projectResult.data;

        // 3. 이미지 업로드 (있는 경우)
        if (this.projectForm.mainImage) {
          this.currentStep = "이미지 업로드 중...";
          this.uploadProgress = 60;

          const imageResult = await imageAPI.uploadProjectImages([this.projectForm.mainImage], newProject.id);
          if (imageResult.success) {
            // 프로젝트에 이미지 URL 업데이트
            const imageUrls = imageResult.data.images.map(img => img.publicUrl);
            await projectAPI.updateProject(newProject.id, { image_urls: imageUrls });
            this.uploadProgress = 90;
          } else {
            console.warn('이미지 업로드 실패:', imageResult.error);
          }
        }

        this.currentStep = "완료 중...";
        this.uploadProgress = 100;

        // 4. 임시 저장 데이터 삭제
        this.clearDraftData();

        // 5. 성공 모달 표시
        setTimeout(() => {
          this.showProgress = false;
          this.isSubmitting = false;
          this.stopLoading();
          this.showSuccessModal(
            '프로젝트 저장 완료',
            '프로젝트가 성공적으로 저장되었습니다! 프로젝트 목록 페이지로 이동하시겠습니까?',
            '/post-list'
          );
        }, 500);

      } catch (error) {
        console.error('프로젝트 제출 오류:', error);
        this.showErrorMessage(error.message || '프로젝트 저장 중 오류가 발생했습니다.');
        this.showProgress = false;
        this.isSubmitting = false;
        this.stopLoading();
      }
    },

    // 임시 저장
    async saveDraft() {
      try {
        const draftData = {
          ...this.projectForm,
          mainImage: null, // 파일은 저장하지 않음
          imagePreview: null, // URL도 저장하지 않음
          lastSaved: new Date().toISOString()
        };

        localStorage.setItem('createPost_draft', JSON.stringify(draftData));
        this.lastSaved = new Date();
        this.isDraft = true;

      } catch (error) {
        console.error('임시 저장 오류:', error);
      }
    },

    // 임시 저장 데이터 로드
    loadDraftData() {
      try {
        const draftData = localStorage.getItem('createPost_draft');
        if (draftData) {
          const parsed = JSON.parse(draftData);
          this.projectForm = {
            ...this.projectForm,
            ...parsed,
            mainImage: null,
            imagePreview: null
          };
          this.lastSaved = new Date(parsed.lastSaved);
          this.isDraft = true;
        }
      } catch (error) {
        console.error('임시 저장 데이터 로드 오류:', error);
      }
    },

    // 임시 저장 데이터 삭제
    clearDraftData() {
      localStorage.removeItem('createPost_draft');
      this.isDraft = false;
      this.lastSaved = null;
    },

    // 에러 설정
    setFieldError(field, message) {
      this.errors = { ...this.errors, [field]: message };
    },

    // 에러 제거
    clearFieldError(field) {
      const newErrors = { ...this.errors };
      delete newErrors[field];
      this.errors = newErrors;
    },

    // 성공 모달 표시
    showSuccessModal(title, message, redirectTo) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalRedirectTo = redirectTo;
      this.showModal = true;
    },

    // 모달 확인
    handleModalConfirm() {
      this.showModal = false;
      if (this.modalRedirectTo) {
        this.$router.push(this.modalRedirectTo);
      }
    },

    // 모달 취소
    handleModalCancel() {
      this.showModal = false;
      this.modalRedirectTo = null;
    },

    // 폼 입력 시 자동 임시 저장
    onFormChange() {
      if (this.projectForm.title || this.projectForm.description) {
        this.saveDraft();
      }
    },

    // 마지막 저장 시간 포맷팅
    formatLastSaved() {
      if (!this.lastSaved) return '';
      
      const now = new Date();
      const diff = now - this.lastSaved;
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return '방금 전';
      if (minutes < 60) return `${minutes}분 전`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}시간 전`;
      
      return this.lastSaved.toLocaleDateString();
    }
  },
};
</script>

<style scoped>
.create-post {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.page-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* 임시 저장 상태 */
.draft-status {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 10px;
  display: inline-block;
}

/* 전역 에러 메시지 */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.global-error {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.error-icon {
  font-size: 1.2rem;
}

.close-error-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: auto;
  padding: 0;
}

/* 진행률 바 */
.progress-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-text {
  color: #2c3e50;
  font-weight: 500;
}

.progress-percentage {
  color: #42b883;
  font-weight: bold;
}

.progress-bar {
  background: #e9ecef;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #42b883 0%, #369870 100%);
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
}

/* 필드 에러 메시지 */
.field-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

/* 에러 상태 입력 필드 */
.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.file-upload-area.error {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.form-container {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b883;
}

.form-group small {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}

/* 파일 업로드 */
.file-upload-area {
  position: relative;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #42b883;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  pointer-events: none;
}

.image-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

/* 기술 스택 */
.tech-stack-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tech-stack-input input {
  flex: 1;
}

.add-tech-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.add-tech-btn:hover {
  background: #369870;
}

.tech-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-tech {
  background: #dc3545;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 액션 버튼 */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel {
  padding: 12px 25px;
  border: 2px solid #6c757d;
  color: #6c757d;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #6c757d;
  color: white;
}

.btn-submit {
  padding: 12px 25px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #369870;
}

.btn-submit:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* 임시 저장 버튼 */
.btn-draft {
  padding: 12px 25px;
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-draft:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.btn-draft:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 로딩 스피너 */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
@media (max-width: 768px) {
  .create-post {
    padding: 20px;
  }

  .form-container {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel, .btn-draft, .btn-submit {
    text-align: center;
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