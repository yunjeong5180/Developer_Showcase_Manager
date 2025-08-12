<template>
  <div class="admin-page create-post">
    <div class="admin-container">
      <!-- 페이지 헤더 -->
      <div class="page-header">
        <h1>{{ isEditMode ? "프로젝트 수정" : "새 프로젝트" }}</h1>
        <p>
          {{
            isEditMode
              ? "프로젝트 정보를 수정하세요"
              : "포트폴리오에 추가할 프로젝트를 작성하세요"
          }}
        </p>
      </div>

      <!-- 프로젝트 작성 폼 -->
      <div class="card">
        <form @submit.prevent="handleSubmit">
          <!-- 기본 정보 섹션 -->
          <div class="section">
            <h3 class="section-title">📝 기본 정보</h3>

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
            <h3 class="section-title">🛠️ 기술 스택</h3>

            <div class="form-group">
              <label>사용된 기술</label>
              <div class="tech-input-wrapper">
                <input
                  v-model="newTech"
                  type="text"
                  placeholder="기술명 입력 후 Enter"
                  @keydown.enter.prevent="addTech"
                />
                <button
                  type="button"
                  @click="addTech"
                  class="btn btn-secondary btn-sm"
                >
                  추가
                </button>
              </div>
              <div class="tech-tags">
                <span
                  v-for="(tech, index) in form.technologies"
                  :key="index"
                  class="tech-tag"
                >
                  {{ tech }}
                  <button
                    type="button"
                    @click="removeTech(index)"
                    class="remove-btn"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- 링크 섹션 -->
          <div class="section">
            <h3 class="section-title">🔗 관련 링크</h3>

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
            <h3 class="section-title">📸 프로젝트 이미지</h3>

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
  </div>
</template>

<script>
import {
  createProject,
  getProject,
  updateProject,
} from "@/services/projectService";
import { imageAPI } from "@/services/imageService";

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
      newTech: "",
      imageFiles: [],
      imagePreviewUrls: [],
      existingImages: [],
      errors: {},
      isSubmitting: false,
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
        const result = await getProject(this.projectId);
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

    addTech() {
      if (
        this.newTech.trim() &&
        !this.form.technologies.includes(this.newTech.trim())
      ) {
        this.form.technologies.push(this.newTech.trim());
        this.newTech = "";
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
          technologies: this.form.technologies,
          github_url: this.form.githubUrl || null,
          live_url: this.form.liveUrl || null,
          category: this.form.category || null,
          is_featured: this.form.isFeatured,
        };

        let result;
        if (this.isEditMode) {
          result = await updateProject(this.projectId, projectData);
        } else {
          result = await createProject(projectData);
        }

        if (result.success) {
          const projectId = result.data.id || this.projectId;

          // 이미지 업로드
          if (this.imageFiles.length > 0) {
            await imageAPI.uploadProjectImages(this.imageFiles, projectId);
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
@import "@/shared/styles/admin-common";

.create-post {
  .section {
    margin-bottom: 40px;

    &-title {
      font-size: 1.3rem;
      color: #212529;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e9ecef;
      font-weight: 600;
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

  .tech-input-wrapper {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
    }
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;

    .tech-tag {
      background: #f8f9fa;
      color: $accent-color;
      padding: 8px 12px;
      border-radius: $border-radius-lg;
      border: 1px solid $accent-color;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;

      .remove-btn {
        background: rgba(255, 255, 255, 0.3);
        border: none;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        line-height: 1;
        transition: background 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.5);
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
      border: 2px dashed #dee2e6;
      border-radius: $border-radius-lg;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;

      &:hover {
        border-color: $accent-color;
        background: white;

        .upload-icon {
          transform: scale(1.1);
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
    gap: 15px;
    margin-top: 40px;
    padding-top: 30px;
    border-top: 2px solid #e9ecef;
  }
}
</style>
