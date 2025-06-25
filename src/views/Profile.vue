<template>
  <div class="profile">
    <div class="page-header">
      <h1>👤 프로필 관리</h1>
      <p>개인 정보와 포트폴리오 설정을 관리하세요</p>
    </div>

    <div class="profile-container">
      <!-- 프로필 사진 섹션 -->
      <div class="profile-photo-section">
        <div class="photo-container">
          <img
            :src="profileForm.profileImage || defaultAvatar"
            alt="프로필 사진"
            class="profile-photo"
          />
          <div class="photo-upload-overlay">
            <input
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              class="photo-input"
              id="photoUpload"
            />
            <label for="photoUpload" class="photo-upload-btn">
              📷 사진 변경
            </label>
          </div>
        </div>
        <h2>{{ profileForm.name || "사용자명" }}</h2>
        <p class="profile-role">{{ profileForm.title || "개발자" }}</p>
      </div>

      <!-- 기본 정보 폼 -->
      <div class="profile-form-section">
        <form @submit.prevent="handleSubmit" class="profile-form">
          <div class="form-section">
            <h3>기본 정보</h3>

            <div class="form-group">
              <label for="name">이름 *</label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                placeholder="예: 홍길동"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">이메일</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                placeholder="your@email.com"
                disabled
              />
              <small>이메일은 변경할 수 없습니다</small>
            </div>

            <div class="form-group">
              <label for="title">직책/타이틀</label>
              <input
                id="title"
                v-model="profileForm.title"
                type="text"
                placeholder="예: Frontend Developer"
              />
            </div>

            <div class="form-group">
              <label for="oneLiner">한 줄 소개</label>
              <input
                id="oneLiner"
                v-model="profileForm.oneLiner"
                type="text"
                placeholder="예: 사용자 경험을 중시하는 프론트엔드 개발자입니다"
                maxlength="100"
              />
              <small>{{ profileForm.oneLiner?.length || 0 }}/100자</small>
            </div>

            <div class="form-group">
              <label for="bio">상세 소개</label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                rows="5"
                placeholder="자신에 대한 상세한 소개를 작성해주세요"
                maxlength="500"
              ></textarea>
              <small>{{ profileForm.bio?.length || 0 }}/500자</small>
            </div>
          </div>

          <div class="form-section">
            <h3>링크 정보</h3>

            <div class="form-group">
              <label for="githubUrl">GitHub URL</label>
              <input
                id="githubUrl"
                v-model="profileForm.githubUrl"
                type="url"
                placeholder="https://github.com/username"
              />
            </div>

            <div class="form-group">
              <label for="linkedinUrl">LinkedIn URL</label>
              <input
                id="linkedinUrl"
                v-model="profileForm.linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div class="form-group">
              <label for="portfolioUrl">개인 웹사이트</label>
              <input
                id="portfolioUrl"
                v-model="profileForm.portfolioUrl"
                type="url"
                placeholder="https://your-website.com"
              />
            </div>

            <div class="form-group">
              <label for="blogUrl">블로그 URL</label>
              <input
                id="blogUrl"
                v-model="profileForm.blogUrl"
                type="url"
                placeholder="https://your-blog.com"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>연락 정보</h3>

            <div class="form-group">
              <label for="phone">전화번호</label>
              <input
                id="phone"
                v-model="profileForm.phone"
                type="tel"
                placeholder="010-1234-5678"
              />
            </div>

            <div class="form-group">
              <label for="location">거주지</label>
              <input
                id="location"
                v-model="profileForm.location"
                type="text"
                placeholder="예: 서울, 대한민국"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>기술 스택</h3>

            <div class="form-group">
              <label>주요 기술</label>
              <div class="skill-input">
                <input
                  v-model="newSkill"
                  type="text"
                  placeholder="기술명을 입력하고 Enter 또는 + 버튼을 누르세요"
                  @keyup.enter="addSkill"
                />
                <button type="button" @click="addSkill" class="add-skill-btn">
                  +
                </button>
              </div>
              <div class="skills-list">
                <span
                  v-for="(skill, index) in profileForm.skills"
                  :key="index"
                  class="skill-tag"
                >
                  {{ skill }}
                  <button
                    type="button"
                    @click="removeSkill(index)"
                    class="remove-skill"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- 저장 버튼 -->
          <div class="form-actions">
            <button type="submit" class="btn-save" :disabled="isSaving">
              {{ isSaving ? "저장 중..." : "프로필 저장" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 미리보기 섹션 -->
    <div class="preview-section">
      <h3>포트폴리오 미리보기</h3>
      <div class="portfolio-preview">
        <div class="preview-header">
          <img
            :src="profileForm.profileImage || defaultAvatar"
            alt="프로필"
            class="preview-photo"
          />
          <div class="preview-info">
            <h2>{{ profileForm.name || "사용자명" }}</h2>
            <p class="preview-title">{{ profileForm.title || "개발자" }}</p>
            <p class="preview-oneliner">{{ profileForm.oneLiner || "한 줄 소개" }}</p>
          </div>
        </div>

        <div class="preview-bio">
          <h4>소개</h4>
          <p>{{ profileForm.bio || "상세 소개가 여기에 표시됩니다." }}</p>
        </div>

        <div class="preview-skills" v-if="profileForm.skills?.length">
          <h4>기술 스택</h4>
          <div class="preview-skills-list">
            <span
              v-for="skill in profileForm.skills"
              :key="skill"
              class="preview-skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="preview-links">
          <h4>링크</h4>
          <div class="preview-links-list">
            <a v-if="profileForm.githubUrl" :href="profileForm.githubUrl" target="_blank">
              🔗 GitHub
            </a>
            <a v-if="profileForm.linkedinUrl" :href="profileForm.linkedinUrl" target="_blank">
              🔗 LinkedIn
            </a>
            <a v-if="profileForm.portfolioUrl" :href="profileForm.portfolioUrl" target="_blank">
              🔗 웹사이트
            </a>
            <a v-if="profileForm.blogUrl" :href="profileForm.blogUrl" target="_blank">
              🔗 블로그
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfilePage",
  data() {
    return {
      profileForm: {
        name: "홍길동",
        email: "hong@example.com",
        title: "Frontend Developer",
        oneLiner: "사용자 경험을 중시하는 프론트엔드 개발자입니다",
        bio: "3년차 프론트엔드 개발자로, Vue.js와 React를 주로 사용합니다. 사용자 중심의 인터페이스 설계에 관심이 많으며, 깔끔하고 직관적인 웹 애플리케이션을 만드는 것을 좋아합니다.",
        profileImage: null,
        githubUrl: "https://github.com/example",
        linkedinUrl: "",
        portfolioUrl: "",
        blogUrl: "",
        phone: "",
        location: "서울, 대한민국",
        skills: ["Vue.js", "JavaScript", "CSS3", "HTML5", "Git"]
      },
      newSkill: "",
      isSaving: false,
      defaultAvatar: "https://via.placeholder.com/150/42b883/ffffff?text=👤"
    };
  },
  methods: {
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileForm.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addSkill() {
      if (this.newSkill.trim() && !this.profileForm.skills.includes(this.newSkill.trim())) {
        this.profileForm.skills.push(this.newSkill.trim());
        this.newSkill = "";
      }
    },
    removeSkill(index) {
      this.profileForm.skills.splice(index, 1);
    },
    async handleSubmit() {
      this.isSaving = true;

      // 임시 저장 로직 (나중에 API 연동)
      console.log("프로필 저장:", this.profileForm);

      setTimeout(() => {
        this.isSaving = false;
        alert("프로필이 성공적으로 저장되었습니다!");
      }, 1000);
    }
  }
};
</script>

<style scoped>
.profile {
  padding: 30px;
  max-width: 1200px;
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

.profile-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  margin-bottom: 50px;
}

/* 프로필 사진 섹션 */
.profile-photo-section {
  text-align: center;
}

.photo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #42b883;
}

.photo-upload-overlay {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.photo-input {
  display: none;
}

.photo-upload-btn {
  background: #42b883;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.photo-upload-btn:hover {
  background: #369870;
}

.profile-photo-section h2 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.profile-role {
  color: #42b883;
  font-weight: 600;
}

/* 폼 섹션 */
.profile-form-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 20px;
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

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.form-group small {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}

/* 스킬 입력 */
.skill-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.skill-input input {
  flex: 1;
}

.add-skill-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.add-skill-btn:hover {
  background: #369870;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-skill {
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

/* 저장 버튼 */
.form-actions {
  text-align: center;
  padding-top: 20px;
}

.btn-save {
  background: #42b883;
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  background: #369870;
}

.btn-save:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* 미리보기 섹션 */
.preview-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.preview-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.portfolio-preview {
  border: 2px dashed #e9ecef;
  border-radius: 10px;
  padding: 30px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.preview-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.preview-info h2 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.preview-title {
  color: #42b883;
  font-weight: 600;
  margin-bottom: 5px;
}

.preview-oneliner {
  color: #6c757d;
}

.preview-bio,
.preview-skills,
.preview-links {
  margin-bottom: 25px;
}

.preview-bio h4,
.preview-skills h4,
.preview-links h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.preview-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-skill-tag {
  background: #42b883;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.preview-links-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.preview-links-list a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.preview-links-list a:hover {
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 768px) {
  .profile {
    padding: 20px;
  }

  .profile-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .preview-header {
    flex-direction: column;
    text-align: center;
  }

  .preview-photo {
    width: 100px;
    height: 100px;
  }
}
</style>