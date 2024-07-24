<template>
  <van-notice-bar color="#1989fa" background="#ecf9ff" scrollable text="与君偕行——本系统致力于解决学科竞赛组队/日常找搭子等伙伴匹配场景！" />

  <van-cell center>
    <div class="cell-content">
      <span class="title">智能匹配</span>
      <van-icon
          name="question-o"
          class="tooltip-icon"
          @click="show = !show"
      />
      <van-popup v-model:show="show" position="top-right" :round="true" :overlay="true">
        <div class="tooltip-content">
          智能匹配即通过你设置的标签，智能匹配与你标签最接近的伙伴，和志同道合的朋友聊聊吧！
        </div>
      </van-popup>
    </div>
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24" />
    </template>
  </van-cell>

  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
<!--  <van-pagination-->
<!--      v-model="currentPage"-->
<!--      :total-items="totalItem"-->
<!--      :show-page-size="3"-->
<!--      :items-per-page="itemsPerPage"-->
<!--      force-ellipses-->
<!--      @change="loadData"-->
<!--  />-->
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import myAxios from "../plugins/myAxios";
import { Toast } from "vant";
import UserCardList from "../components/UserCardList.vue";
import { UserType } from "../models/user";

const isMatchMode = ref<boolean>(false);
const userList = ref<UserType[]>([]);
const loading = ref(true);
// const currentPage = ref(1); // 当前页码
// const totalItem = ref(12); // 总记录数量
// const itemsPerPage = ref(10); // 每页展示的记录数
//

const loadData = async () => {
  let userListData;
  loading.value = true;
  // 心动模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: { num }
    })
        .then(response => {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(error => {
          console.error('/user/match error', error);
          Toast.fail('请求失败');
        });
  } else {
    userListData = await myAxios.get('/user/recommend', {
      params: { pageSize: 20, pageNum: 1 }
    })
        .then(response => {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(error => {
          console.error('/user/recommend error', error);
          Toast.fail('请求失败');
        });
  }

  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
});

const show = ref(false);
</script>

<style scoped>
.cell-content {
  display: flex;
  align-items: center;
}

.title {
  margin-right: 4px; /* 设置文字和图标之间的间距 */
}

.tooltip-icon {
  font-size: 24px;
  cursor: pointer;
}

.tooltip-content {
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
