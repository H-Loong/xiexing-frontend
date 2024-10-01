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
              :rules="[{ required: true, message: '请填写账号' }]"
          />
          <van-field
              v-model="userPassword"
              type="password"
              name="userPassword"
              required
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            登陆
          </van-button>
        </div>
        <div style="margin: 16px;">
          <van-button round plain block type="primary" native-type="submit" @click="moveToRegister">
            还没有账号？去注册
          </van-button>
        </div>
      </van-form>
    </div>
    <copyright/>
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

// 跳转到登录页
const moveToRegister = () => {
  router.push('/user/register')
}
const onSubmit = async () => {
  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  });
  if (res.code === 0 && res.data) {
    Toast.success('登录成功');
    const redirectUrl = route.query?.redirect as string ?? '/';
    window.location.href = redirectUrl;
  } else {
    Toast.fail('登录失败');
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

</style>
