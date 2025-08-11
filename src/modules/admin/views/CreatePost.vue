<template>
  <div class="create-post">
    <div class="page-header">
      <h1>✏️ 새 프로젝트 추가</h1>
      <p>포트폴리오에 새로운 프로젝트를 추가하세요</p>
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
          />
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
          ></textarea>
        </div>

        <!-- 배포 URL -->
        <div class="form-group">
          <label for="projectUrl">배포 URL</label>
          <input
            id="projectUrl"
            v-model="projectForm.projectUrl"
            type="url"
            placeholder="https://your-project.com"
          />
        </div>

        <!-- GitHub URL -->
        <div class="form-group">
          <label for="githubUrl">GitHub 저장소 URL</label>
          <input
            id="githubUrl"
            v-model="projectForm.githubUrl"
            type="url"
            placeholder="https://github.com/username/repository"
          />
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
            />
          </div>
          <div class="form-group">
            <label for="endDate">종료일</label>
            <input
              id="endDate"
              v-model="projectForm.endDate"
              type="date"
            />
            <small>진행 중인 프로젝트는 비워두세요</small>
          </div>
        </div>

        <!-- 대표 이미지 -->
        <div class="form-group">
          <label for="mainImage">대표 이미지</label>
          <div class="file-upload-area">
            <input
              id="mainImage"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
            />
            <div class="upload-placeholder">
              <span v-if="!projectForm.imagePreview">
                📷 이미지를 선택하거나 드래그해주세요
              </span>
              <img
                v-else
                :src="projectForm.imagePreview"
                alt="미리보기"
                class="image-preview"
              />
            </div>
          </div>
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
            />
            <button type="button" @click="addTechStack" class="add-tech-btn">
              +
            </button>
          </div>
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
        </div>

        <!-- 제출 버튼 -->
        <div class="form-actions">
          <router-link to="/post-list" class="btn-cancel">취소</router-link>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? "저장 중..." : "프로젝트 저장" }}
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
import { projectService, imageService } from '@/shared/services';

export default {
  name: "CreatePostPage",
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
      
      // 모달 상태
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalRedirectTo: null
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.projectForm.mainImage = file;
        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          this.projectForm.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addTechStack() {
      console.log('Add tech stack 호출:', this.newTech);
      if (this.newTech.trim() && !this.projectForm.techStack.includes(this.newTech.trim())) {
        this.projectForm.techStack.push(this.newTech.trim());
        this.newTech = "";
        console.log('기술 스택 추가됨:', this.projectForm.techStack);
      } else {
        console.log('기술 스택 추가 실패 - 이미 존재하거나 빈 값');
      }
    },
    removeTechStack(index) {
      this.projectForm.techStack.splice(index, 1);
    },
    validateForm() {
      // URL 유효성 검사
      if (this.projectForm.projectUrl && !this.isValidUrl(this.projectForm.projectUrl)) {
        alert('유효한 프로젝트 URL을 입력해주세요.');
        return false;
      }
      
      if (this.projectForm.githubUrl && !this.isValidUrl(this.projectForm.githubUrl)) {
        alert('유효한 GitHub URL을 입력해주세요.');
        return false;
      }
      
      return true;
    },
    
    isValidUrl(url) {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch (e) {
        return false;
      }
    },

    async handleSubmit() {
      // 폼 검증
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;

      try {
        console.log("프로젝트 저장 시작:", this.projectForm);

        // 1. 이미지 업로드 (있는 경우)
        let imageUrls = [];
        if (this.projectForm.mainImage) {
          console.log("이미지 업로드 시작");
          const imageResponse = await imageService.uploadImage(this.projectForm.mainImage, 'project-images');
          
          if (imageResponse.success) {
            imageUrls = [imageResponse.data.url];
            console.log("이미지 업로드 성공:", imageUrls);
          } else {
            console.warn("이미지 업로드 실패:", imageResponse.error);
            // 이미지 업로드 실패해도 프로젝트는 저장 진행
          }
        }

        // 2. 프로젝트 데이터 준비
        const projectData = {
          title: this.projectForm.title.trim(),
          description: this.projectForm.description.trim(),
          tech_stack: this.projectForm.techStack,
          github_url: this.projectForm.githubUrl.trim() || null,
          demo_url: this.projectForm.projectUrl.trim() || null,
          image_urls: imageUrls,
          start_date: this.projectForm.startDate || null,
          end_date: this.projectForm.endDate || null,
          is_featured: false
        };

        // 3. 프로젝트 생성
        console.log("프로젝트 API 호출:", projectData);
        const response = await projectService.createProject(projectData);

        if (response.success) {
          console.log("프로젝트 생성 성공:", response.data);
          
          // 폼 초기화
          this.resetForm();
          
          this.showSuccessModal(
            '프로젝트 저장 완료', 
            '프로젝트가 성공적으로 저장되었습니다! 프로젝트 목록 페이지로 이동하시겠습니까?', 
            '/post-list'
          );
        } else {
          console.error("프로젝트 생성 실패:", response.error);
          alert(`프로젝트 저장 실패: ${response.error}`);
        }

      } catch (error) {
        console.error("프로젝트 저장 예외:", error);
        alert(`프로젝트 저장 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        this.isSubmitting = false;
      }
    },

    showSuccessModal(title, message, redirectTo) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalRedirectTo = redirectTo;
      this.showModal = true;
    },

    handleModalConfirm() {
      this.showModal = false;
      if (this.modalRedirectTo) {
        this.$router.push(this.modalRedirectTo);
      }
    },

    handleModalCancel() {
      this.showModal = false;
      this.modalRedirectTo = null;
    },

    resetForm() {
      this.projectForm = {
        title: "",
        description: "",
        projectUrl: "",
        githubUrl: "",
        startDate: "",
        endDate: "",
        mainImage: null,
        imagePreview: null,
        techStack: [],
      };
      this.newTech = "";
      
      // 파일 입력 초기화
      const fileInput = document.getElementById('mainImage');
      if (fileInput) {
        fileInput.value = '';
      }
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