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
  </div>
</template>

<script>
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
      if (this.newTech.trim() && !this.projectForm.techStack.includes(this.newTech.trim())) {
        this.projectForm.techStack.push(this.newTech.trim());
        this.newTech = "";
      }
    },
    removeTechStack(index) {
      this.projectForm.techStack.splice(index, 1);
    },
    async handleSubmit() {
      this.isSubmitting = true;

      // 임시 저장 로직 (나중에 API 연동)
      console.log("프로젝트 저장:", this.projectForm);

      setTimeout(() => {
        this.isSubmitting = false;
        alert("프로젝트가 성공적으로 저장되었습니다!");
        this.$router.push("/post-list");
      }, 1000);
    },
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
}
</style>