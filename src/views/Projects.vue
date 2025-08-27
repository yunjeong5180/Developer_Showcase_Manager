<template>
  <div class="admin-page projects-management">
    <div class="admin-container">
      <!-- 페이지 헤더 -->
      <div class="page-header">
        <h1>프로젝트 관리</h1>
        <p>프로젝트 설정 및 관리 도구</p>
      </div>

      <!-- 관리 섹션 -->
      <div class="management-sections">
        <!-- 카테고리 관리 섹션 -->
        <div class="section-card">
          <div class="section-header">
            <h2>카테고리 관리</h2>
            <button @click="addCategory" class="btn-add">
              <span>➕ 새 카테고리</span>
            </button>
          </div>
          <div class="category-grid">
            <div v-for="category in categories" :key="category.id" class="category-card">
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-info">
                <h4>{{ category.name }}</h4>
                <span class="category-count">{{ category.count }}개 프로젝트</span>
              </div>
              <div class="category-actions">
                <button @click="editCategory(category)" class="btn-icon" title="수정">
                  ✏️
                </button>
                <button @click="deleteCategory(category)" class="btn-icon" title="삭제">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 태그 관리 섹션 -->
        <div class="section-card">
          <div class="section-header">
            <h2>태그 관리</h2>
            <button @click="addTag" class="btn-add">
              <span>➕ 새 태그</span>
            </button>
          </div>
          <div class="tags-container">
            <div v-for="tag in tags" :key="tag.id" class="tag-item">
              <span class="tag-name">{{ tag.name }}</span>
              <span class="tag-count">({{ tag.count }})</span>
              <button @click="removeTag(tag)" class="tag-remove">×</button>
            </div>
          </div>
        </div>

        <!-- 프로젝트 템플릿 섹션 -->
        <div class="section-card">
          <div class="section-header">
            <h2>프로젝트 템플릿</h2>
            <button @click="createTemplate" class="btn-add">
              <span>➕ 템플릿 생성</span>
            </button>
          </div>
          <div class="template-list">
            <div v-for="template in templates" :key="template.id" class="template-item">
              <div class="template-icon">📄</div>
              <div class="template-info">
                <h4>{{ template.name }}</h4>
                <p>{{ template.description }}</p>
              </div>
              <div class="template-actions">
                <button @click="useTemplate(template)" class="btn-use">사용</button>
                <button @click="editTemplate(template)" class="btn-edit">수정</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 데이터 관리 섹션 -->
        <div class="section-card">
          <div class="section-header">
            <h2>데이터 관리</h2>
          </div>
          <div class="data-actions">
            <div class="action-card">
              <div class="action-icon">📥</div>
              <h4>프로젝트 가져오기</h4>
              <p>JSON, CSV 파일에서 프로젝트 데이터를 가져옵니다</p>
              <button @click="importData" class="btn-action">파일 선택</button>
            </div>
            <div class="action-card">
              <div class="action-icon">📤</div>
              <h4>프로젝트 내보내기</h4>
              <p>모든 프로젝트를 JSON 형식으로 내보냅니다</p>
              <button @click="exportData" class="btn-action">내보내기</button>
            </div>
            <div class="action-card">
              <div class="action-icon">🔄</div>
              <h4>데이터 동기화</h4>
              <p>GitHub 저장소와 프로젝트 데이터를 동기화합니다</p>
              <button @click="syncData" class="btn-action">동기화</button>
            </div>
            <div class="action-card">
              <div class="action-icon">🗑️</div>
              <h4>데이터 정리</h4>
              <p>미사용 이미지 및 임시 데이터를 정리합니다</p>
              <button @click="cleanupData" class="btn-action">정리하기</button>
            </div>
          </div>
        </div>

        <!-- 고급 설정 섹션 -->
        <div class="section-card">
          <div class="section-header">
            <h2>고급 설정</h2>
          </div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h4>자동 백업</h4>
                <p>프로젝트 변경사항을 자동으로 백업합니다</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.autoBackup">
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>버전 관리</h4>
                <p>프로젝트 수정 이력을 자동 저장합니다</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.versionControl">
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>이미지 최적화</h4>
                <p>업로드된 이미지를 자동으로 최적화합니다</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.imageOptimization">
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>API 액세스</h4>
                <p>외부 API를 통한 프로젝트 관리를 허용합니다</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.apiAccess">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectsManagement",
  data() {
    return {
      categories: [
        { id: 1, name: "웹 개발", icon: "🌐", count: 5 },
        { id: 2, name: "모바일 앱", icon: "📱", count: 3 },
        { id: 3, name: "AI/ML", icon: "🤖", count: 2 },
        { id: 4, name: "게임", icon: "🎮", count: 1 },
        { id: 5, name: "데이터 분석", icon: "📊", count: 2 },
      ],
      tags: [
        { id: 1, name: "React", count: 8 },
        { id: 2, name: "Vue.js", count: 6 },
        { id: 3, name: "Node.js", count: 5 },
        { id: 4, name: "Python", count: 4 },
        { id: 5, name: "TypeScript", count: 7 },
      ],
      templates: [
        {
          id: 1,
          name: "기본 웹 프로젝트",
          description: "HTML, CSS, JavaScript 기본 구조",
        },
        {
          id: 2,
          name: "React SPA",
          description: "React 단일 페이지 애플리케이션 템플릿",
        },
        {
          id: 3,
          name: "풀스택 프로젝트",
          description: "프론트엔드 + 백엔드 + 데이터베이스 구조",
        },
      ],
      settings: {
        autoBackup: true,
        versionControl: true,
        imageOptimization: false,
        apiAccess: false,
      },
    };
  },
  methods: {
    addCategory() {
      alert("카테고리 추가 기능 준비 중입니다");
    },
    editCategory(category) {
      alert(`${category.name} 카테고리 수정`);
    },
    deleteCategory(category) {
      if (confirm(`${category.name} 카테고리를 삭제하시겠습니까?`)) {
        this.categories = this.categories.filter(c => c.id !== category.id);
      }
    },
    addTag() {
      alert("태그 추가 기능 준비 중입니다");
    },
    removeTag(tag) {
      if (confirm(`${tag.name} 태그를 삭제하시겠습니까?`)) {
        this.tags = this.tags.filter(t => t.id !== tag.id);
      }
    },
    createTemplate() {
      alert("템플릿 생성 기능 준비 중입니다");
    },
    useTemplate(template) {
      alert(`${template.name} 템플릿 사용`);
    },
    editTemplate(template) {
      alert(`${template.name} 템플릿 수정`);
    },
    importData() {
      alert("데이터 가져오기 기능 준비 중입니다");
    },
    exportData() {
      alert("데이터 내보내기 기능 준비 중입니다");
    },
    syncData() {
      alert("GitHub 동기화 기능 준비 중입니다");
    },
    cleanupData() {
      alert("데이터 정리 기능 준비 중입니다");
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;

.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px 20px;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
}

.management-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f1f3f5;

    h2 {
      font-size: 1.4rem;
      color: #1a1a2e;
      font-weight: 600;
    }

    .btn-add {
      padding: 8px 16px;
      background: #212529;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: #2c3e50;
        transform: translateY(-1px);
      }
    }
  }
}

// 카테고리 관리
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;

  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;

    &:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .category-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    .category-info {
      text-align: center;
      margin-bottom: 12px;

      h4 {
        color: #1a1a2e;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .category-count {
        color: #6c757d;
        font-size: 0.85rem;
      }
    }

    .category-actions {
      display: flex;
      gap: 8px;

      .btn-icon {
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 6px 10px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
        }
      }
    }
  }
}

// 태그 관리
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 20px;
    font-size: 0.9rem;

    .tag-name {
      color: #495057;
      font-weight: 500;
    }

    .tag-count {
      color: #6c757d;
      font-size: 0.85rem;
    }

    .tag-remove {
      background: none;
      border: none;
      color: #dc3545;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      margin-left: 4px;
      line-height: 1;

      &:hover {
        color: #c82333;
      }
    }
  }
}

// 프로젝트 템플릿
.template-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .template-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 10px;
    border: 1px solid #e9ecef;

    .template-icon {
      font-size: 2rem;
    }

    .template-info {
      flex: 1;

      h4 {
        color: #1a1a2e;
        font-weight: 600;
        margin-bottom: 4px;
      }

      p {
        color: #6c757d;
        font-size: 0.9rem;
      }
    }

    .template-actions {
      display: flex;
      gap: 8px;

      button {
        padding: 6px 16px;
        border-radius: 6px;
        border: 1px solid #dee2e6;
        background: white;
        color: #495057;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;

        &.btn-use {
          &:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
          }
        }

        &.btn-edit {
          &:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }
        }
      }
    }
  }
}

// 데이터 관리
.data-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;

  .action-card {
    padding: 24px;
    background: #f8f9fa;
    border-radius: 10px;
    text-align: center;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;

    &:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .action-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    h4 {
      color: #1a1a2e;
      font-weight: 600;
      margin-bottom: 8px;
    }

    p {
      color: #6c757d;
      font-size: 0.85rem;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .btn-action {
      padding: 8px 20px;
      background: white;
      border: 2px solid #212529;
      border-radius: 8px;
      color: #212529;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;

      &:hover {
        background: #212529;
        color: white;
      }
    }
  }
}

// 고급 설정
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 10px;
    border: 1px solid #e9ecef;

    .setting-info {
      flex: 1;

      h4 {
        color: #1a1a2e;
        font-weight: 600;
        margin-bottom: 4px;
      }

      p {
        color: #6c757d;
        font-size: 0.85rem;
      }
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
          background-color: #667eea;
        }

        &:checked + .slider:before {
          transform: translateX(24px);
        }
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.3s;
        border-radius: 24px;

        &:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .data-actions {
    grid-template-columns: 1fr;
  }
}
</style>