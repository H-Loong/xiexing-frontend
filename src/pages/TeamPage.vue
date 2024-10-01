<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch" />

    <div style="margin-bottom: 16px" />
    <team-card-list :teamList="teamList" />
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
    <van-button class="add-button" type="primary" icon="plus" @click="toAddTeam" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import { onMounted, ref } from "vue";
import myAxios from "../plugins/myAxios";
import { Toast } from "vant";
import Copyright from "../components/Copyright.vue";

const active = ref('public');
const router = useRouter();
const searchText = ref('');

const teamList = ref([]);



const toAddTeam = () => {
  router.push({
    path: "/team/add"
  });
};

const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
      status,
    },
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试');
  }
};

onMounted(() => {
  listTeam();
});

const onSearch = (val) => {
  listTeam(val);
};
</script>

<style scoped>
#teamPage {
  position: relative;
}

.add-button {
  position: fixed;
  bottom: 100px;
  right: 16px;
  z-index: 1000;
}
</style>
