<!-- 粉丝列表 -->
<template>
  <!-- 下拉刷新 -->
  <van-pull-refresh v-model="isLoadingDog" :head-height="80" @refresh="loadData">
    <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
    <template #pulling="props">
      <img
          class="doge"
          src="https://your-avatar-address-bucketName/doge.png"
          :style="{ transform: `scale(${props.distance / 80})` }"
      />
    </template>
    <!-- 释放提示 -->
    <template #loosing>
      <img
          class="doge"
          src="https://your-avatar-address-bucketName/doge.png"
      />
    </template>
    <!-- 加载提示 -->
    <template #loading>
      <img
          class="doge"
          src="https://your-avatar-address-bucketName/doge-fire.jpg"
      />
    </template>

    <!-- 用户卡片列表 -->
    <user-card-list :user-list="userList" :loading="loading"/>
    <van-divider/>
    <!-- 未加载到数据 -->
    <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
  </van-pull-refresh>


</template>

<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import UserCardList from "../components/UserCardList.vue";
import myAxios from "../plugins/myAxios";

const userList = ref([]); // 用户集合

const loading = ref(true);
const isLoadingDog = ref(false); // 下拉刷新图标

/**
 * 获取粉丝列表
 */
const loadData = async () => {
  loading.value = true;
  isLoadingDog.value = true;

  const res = await myAxios.get('/friends/fans');
  if (res?.code === 0) {
    res?.data.forEach((user: { tags: string; }) => { // 解析后端返回的json字符串为js数组
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = res.data;
  }

  loading.value = false;
  isLoadingDog.value = false;
}

// 监控变量变化触发方法
watchEffect(() => {
  loadData()
})

</script>

<style scoped>
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>