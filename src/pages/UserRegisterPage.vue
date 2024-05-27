<template>
  <div class="background-container">
    <div class="overlay">
      <van-notice-bar color="#1989fa" background="#ecf9ff" scrollable text="与君偕行——本系统致力于解决学科竞赛组队/日常找搭子等伙伴匹配场景！" />

    </div>

    <div class="login-page">

      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
              v-model="userAccount"
              name="userAccount"
              label="账号"
              placeholder="请输入账号"
              :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
              v-model="userPassword"
              type="password"
              name="userPassword"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
              v-model="checkPassword"
              type="password"
              name="checkPassword"
              label="确认密码"
              placeholder="请再次输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
        <a href="/user/login" class="login-link">已有账号？点击登录</a>
      </van-form>
      </div>

  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const router = useRouter();
const route = useRoute();

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');

const onSubmit = async () => {
  const res = await myAxios.post('/user/register', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
  })
  console.log(res, '用户注册');
  if (res.code === 0 && res.data) {
    Toast.success('注册成功');
    // 跳转到之前的页面
    const redirectUrl = route.query?.redirect as string ?? '/user/login';
    window.location.href = redirectUrl;
  } else {
    Toast.fail('注册失败');
  }
};
</script>

<style scoped>
.background-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('https://s2.loli.net/2024/05/19/fijC4xXgDEBq37Q.jpg'); /* 替换为实际的图片路径 */
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(3, 0, 0, 0.6); /* 黑色背景，50% 透明 */
  z-index: 1;
}

.login-page {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.submit-button {
  margin-top: 12px; /* 调整提交按钮距离上方的距离 */
  width: 100%; /* 让按钮铺满容器的宽度 */
}

.login-link {
  font-size: 14px; /* 调整注册链接的字体大小 */
  display: block; /* 将链接变成块级元素 */
  text-align: center; /* 文本居中显示 */
  margin-top: 20px; /* 调整链接距离上方的距离 */
  color: #007bff; /* 调整链接的颜色 */
  text-decoration: none; /* 移除链接的下划线 */
}

.register-link:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}
</style>
