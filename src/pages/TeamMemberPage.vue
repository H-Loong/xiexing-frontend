<!-- 队伍成员列表页 -->
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
    <user-card-list :user-list="memberList" :loading="loading"/>
    <van-divider/>
    <!-- 未加载到数据 -->
    <van-empty v-if="!memberList || memberList.length < 1" description="数据为空"/>
  </van-pull-refresh>


</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import myAxios from '../plugins/myAxios.ts';
import UserCardList from "../components/UserCardList.vue";
import {showFailToast} from "vant";
import {useStore} from "vuex";

const memberList = ref([]); // 用户集合

const loading = ref(true);
const isLoadingDog = ref(false); // 下拉刷新图标

const store = useStore();

const teamId = reactive(store.state.team.id);

const loadData = () => {
  listTeamMembers();
}

/**
 * 获取队伍成员
 */
const listTeamMembers = async () => {
  isLoadingDog.value = true;
  const res = await myAxios.get('/team/members', {
    params: {
      teamId: teamId
    }
  });
  if (res?.code === 0) {
    res.data.forEach(member => {
      if (member.tags) { // 解析后端返回的json字符串
        member.tags = JSON.parse(member.tags);
      }
    })
    memberList.value = res.data;
  } else {
    showFailToast('加载失败!' + res?.description);
  }
  isLoadingDog.value = false;
  loading.value = false;
}

onMounted(() => {
  loadData();
})

</script>

<style scoped>
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>