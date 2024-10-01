<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList" :key="user.id">
    <van-card
        :desc="user.profile ? '个人简介：' + user.profile : '个人简介：该用户比较懒，暂时没有设置'"
        :title="user.username ? user.username : '无名氏'"
        :thumb="user.avatarUrl ? user.avatarUrl : avatar"
    >
      <template #tags>
        <div v-if="user.tags && user.tags.length < 7" style="margin-bottom: 14px"></div>
        标签：<br>
        <van-tag v-if="user.tags" v-for="tag in user.tags" :key="tag" style="margin-right: 8px; margin-top: 8px" class="tag" plain type="primary">
          {{ tag }}
        </van-tag>
        <span v-if="!user.tags || user.tags.length <= 0">该用户暂时没有设置标签</span>
      </template>
      <template #footer>
        <router-link :to="{ path: '/user/show', query: { id: user.id } }">
          <van-button size="mini">联系我</van-button>
        </router-link>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { UserType } from '../models/user';
import avatar from '../assets/avatar.png'

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = defineProps<UserCardListProps>();
</script>

<style scoped>
</style>
