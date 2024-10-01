<template>
  <div class="background-container">
    <van-notice-bar color="#1989fa" background="#ecf9ff" scrollable text="与君偕行——本系统致力于解决学科竞赛组队/日常找搭子等伙伴匹配场景！" />
    <img src="../assets/icon1.jpg" class="header-image" alt="Header Image" />
    <p class="headline">偕行——寻找志同道合的伙伴</p>
    <div class="login-page">

      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
              v-model="userAccount"
              name="userAccount"
              required
              label="账号"
              placeholder="请输入账号"
              :rules="[{ pattern: /^[a-zA-Z0-9_]{4,}$/, message: '最少四位，只允许字母、数字和下划线' }]"
          />
          <van-field
              v-model="userPassword"
              type="password"
              name="userPassword"
              required
              label="密码"
              placeholder="请输入密码"
              :rules="[{ pattern: /^.{6,}$/, message: '密码至少6位' }]"
          />
          <van-field
              v-model="checkPassword"
              type="password"
              name="checkPassword"
              required
              label="确认密码"
              placeholder="请再次输入密码"
              :rules="[{ pattern: /^.{6,}$/, message: '密码至少6位' }]"
          />
          <van-field
              v-model="email"
              name="email"
              required
              label="QQ邮箱"
              placeholder="请输入QQ邮箱"
              :rules="[{ pattern: /^[1-9][0-9]{4,10}@qq\.com$/, message: '请输入有效的QQ邮箱地址'  }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
        <div style="margin: 16px;">
          <van-button round plain block type="primary" native-type="submit" @click="moveToLogin">
            已有账号？去登录
          </van-button>
        </div>

      </van-form>
    </div>
<Copyright/>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import Copyright from "../components/Copyright.vue";

const router = useRouter();
const route = useRoute();

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const email = ref('');


// 跳转到登录页
const moveToLogin = () => {
  router.push('/user/login')
}
const onSubmit = async () => {
  const res = await myAxios.post('/user/register', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    email: email.value,
  })
  console.log(res, '用户注册');
  if (res.code === 0 && res.data) {
    Toast.success('注册成功');
    // 跳转到之前的页面
    const redirectUrl = route.query?.redirect as string ?? '/user/login';
    window.location.href = redirectUrl;
  } else {
    Toast.fail(`注册失败: ${res.description}`);
  }
};
</script>

<style scoped>
.background-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.header-image {
  width: 50%;
  height: auto;
  display: block;
  margin: 1rem auto 0;
}

.headline {
  font-weight: bold;
  margin-top: 0.5rem;
  text-align: center;
}

.login-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
}
.login-link {
  font-size: 14px;
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #007bff;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
