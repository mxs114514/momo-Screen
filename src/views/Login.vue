<template>
  <div class="login-container">
    <!-- 左侧图片和标题区域 -->
    <div class="login-left">
      <div class="left-content">
        <img
          src="@/assets/img/login-left.jpg"
          alt="系统图片"
          class="left-image"
        />
        <h1 class="system-title">绿能管家-智慧云</h1>
        <h1 class="system-title">环保能源与可再生资源软件</h1>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="login-right">
      <div class="login-form">
        <div class="form-header">
          <h2>用户登录</h2>
        </div>

        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          class="login-form-content"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="账号"
              prefix-icon="User"
              size="large"
            >
              <template #prefix>
                <img
                  src="@/assets/img/用户.png"
                  alt="username icon"
                  style="width: 20px; height: 20px; margin-right: 8px"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              size="large"
              show-password
            >
              <template #prefix>
                <img
                  src="@/assets/img/输入框.png"
                  alt="password icon"
                  style="width: 20px; height: 20px; margin-right: 8px"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="companyCode">
            <el-input
              v-model="loginForm.companyCode"
              placeholder="企业编号"
              prefix-icon="OfficeBuilding"
              size="large"
            >
              <template #prefix>
                <img
                  src="@/assets/img/企业.png"
                  alt="password icon"
                  style="width: 20px; height: 20px; margin-right: 8px"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="form-footer">
          <span>忘记密码</span>
          <span>注册账号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const loading = ref(false);
const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
  username: "",
  password: "",
  companyCode: "",
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  companyCode: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;

      // 模拟登录验证
      setTimeout(() => {
        if (
          loginForm.username === "123" &&
          loginForm.password === "123" &&
          loginForm.companyCode === "123"
        ) {
          ElMessage.success("登录成功");
          // 存储登录状态
          localStorage.setItem("isLoggedIn", "true");
          // 跳转到首页
          router.push("/index");
        } else {
          ElMessage.error("账号、密码或企业编号错误");
        }
        loading.value = false;
      }, 1000);
    }
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-image: url("@/assets/img/loginbg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
}

// 左侧图片和标题区域
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;

  .left-content {
    text-align: center;
    display: flex;
    justify-self: center;
    flex-direction: column;
    margin: 0 0 0 300px;

    .left-image {
      width: 300px;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      margin-bottom: 30px;
      margin: 0 auto;
    }

    .system-title {
      color: #fff;
      font-size: 48px;
      font-weight: 600;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: 2px;
    }
  }
}

// 右侧登录表单区域
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 2;

  .login-form {
    width: 400px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.form-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    color: #333;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
}

.login-form-content {
  .el-form-item {
    margin-bottom: 20px;
    position: relative;

    // 科技感输入框样式
    :deep(.el-input__wrapper) {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid transparent;
      background-clip: padding-box;
      position: relative;
      transition: all 0.3s ease;

      &::before {
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        background: linear-gradient(45deg, #00d4ff, #0099cc, #00d4ff);
        border-radius: inherit;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover::before {
        opacity: 0.3;
      }

      &.is-focus {
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);

        &::before {
          opacity: 0.6;
          animation: tech-glow 2s ease-in-out infinite alternate;
        }
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(135deg, #409eff 0%, #0099cc 100%);
    border: none;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 科技感动画
@keyframes tech-glow {
  0% {
    background: linear-gradient(45deg, #00d4ff, #0099cc, #00d4ff);
  }
  50% {
    background: linear-gradient(45deg, #0099cc, #00d4ff, #0099cc);
  }
  100% {
    background: linear-gradient(45deg, #00d4ff, #0099cc, #00d4ff);
  }
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  span {
    color: #666;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-left {
    flex: 0 0 40%;

    .left-content {
      .left-image {
        width: 200px;
        height: 130px;
        margin-bottom: 20px;
      }

      .system-title {
        font-size: 20px;
      }
    }
  }

  .login-right {
    flex: 1;
    padding: 20px;

    .login-form {
      width: 100%;
      max-width: 350px;
      padding: 30px;
    }
  }
}
</style>