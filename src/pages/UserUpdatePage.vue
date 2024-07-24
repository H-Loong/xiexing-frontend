<template>
  <template v-if="user">
    <van-cell title="昵称" is-link to="/user/edit" :value="user.username" @click="toEdit('username', '昵称', user.username)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="性别" is-link :value="genderEnum[user.gender]" @click="toEdit('gender', '性别', user.gender)"/>
    <van-cell title="电话" is-link to="/user/edit" :value="user.phone" @click="toEdit('phone', '电话', user.phone)"/>
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email" @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="个人简介" is-link to="/user/edit" :value="user.profile" @click="toEdit('profile', '个人简介', user.profile)"/>
    <van-cell title="标签" is-link to="/update/tags">
      <template #value>
        <div class="tags-container">
          <van-tag v-for="(tag, index) in user.tags" :key="index" plain type="primary">{{ tag }}</van-tag>
        </div>
      </template>
    </van-cell>
    <van-cell title="注册时间" :value="user.createTime"/>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getCurrentUser } from '../services/user';
import { genderEnum } from '../constants/user';

import type { UserType } from '../models/user';

const user = ref<UserType | null>(null);

onMounted(async () => {
  const currentUser = await getCurrentUser();
  console.log('Current User:', currentUser); // 调试输出
  if (currentUser.tags && typeof currentUser.tags === 'string') {
    currentUser.tags = currentUser.tags
        .replace(/[\[\]"]/g, '') // 移除 [ ] 和 "
        .split(',')
        .map(tag => tag.trim()); // 去除前后空白
  }
  user.value = {
    ...currentUser,
    tags: currentUser.tags || []
  };
  console.log('Processed User Tags:', user.value.tags); // 调试输出
});

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    },
  });
};
</script>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px; /* 调整标签之间的间距 */
  justify-content: flex-end; /* 使标签靠右显示 */
}
</style>
