<template>
  <div v-if="loading" class="loading-container">
    <van-loading type="spinner" size="24px">加载中...</van-loading>
  </div>
  <template v-else-if="user">
    <van-cell title="昵称" :value="user.username"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="头像">
      <img style="height: 48px" :src="user.avatarUrl"/>
    </van-cell>
    <van-cell title="性别" :value="genderEnum[user.gender]"/>
    <van-cell title="电话" :value="user.phone"/>
    <van-cell title="邮箱" :value="user.email"/>
    <van-cell title="个人简介" :value="user.profile"/>
    <van-cell title="标签" is-link to="/update/tags">
      <template #value>
        <div class="tags-container">
          <van-tag v-for="(tag, index) in user.tags" :key="index" plain type="primary">{{ tag }}</van-tag>
        </div>
      </template>
    </van-cell>
    <van-cell title="注册时间" :value="user.createTime"/>
  </template>
  <template v-else>
    <van-empty description="未能加载用户信息" />
  </template>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import myAxios from "../plugins/myAxios";
import { genderEnum } from "../constants/user";

// 定义 User 接口
interface User {
  id: number;
  username: string;
  userAccount: string;
  avatarUrl: string;
  gender: number;
  phone: string;
  email: string;
  profile: string;
  tags: string[];
  createTime: string;
}

const route = useRoute();
const user = ref<User | null>(null);
const loading = ref(true); // 加载状态
const error = ref<string | null>(null); // 错误信息

const loadUser = async () => {
  try {
    const userId = route.query.id;
    if (!userId) {
      throw new Error("用户 ID 缺失");
    }

    console.log('Request URL:', `/user/info?userId=${userId}`);
    const response = await myAxios.get(`/user/info?userId=${userId}`);
    console.log('API Response:', response.data);

    const userData = response.data;
    if (typeof userData.tags === 'string') {
      userData.tags = JSON.parse(userData.tags); // 解析 JSON 字符串
    }
    user.value = userData;
  } catch (err) {
    console.error("Error fetching user data:", err);
    error.value = err.message || "加载用户信息时出错";
  } finally {
    loading.value = false; // 加载完成
  }
};

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px; /* 调整标签之间的间距 */
  justify-content: flex-end; /* 使标签靠右显示 */
}
</style>
