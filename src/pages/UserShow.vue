<template>
  <div v-if="loading" class="loading-container">
    <van-loading type="spinner" size="24px">加载中...</van-loading>
  </div>
  <template v-else-if="user">
    <div class="center">
      <div>
        <img :alt="user?.username" class="img" :src="user?.avatarUrl || avatar" />
      </div>
    </div>
    <div class="centered-container">
      <p class="small-text">
        {{ followCount }} 关注 &nbsp;&nbsp;&nbsp; {{ fanCount }} 粉丝
      </p>
    </div>

    <van-cell title="昵称" :value="user.username" />
    <van-cell title="账号" :value="user.userAccount" />
    <van-cell title="性别" :value="genderEnum[user.gender]" />
    <van-cell title="电话" :value="user.phone" />
    <van-cell title="邮箱" :value="user.email" />
    <van-cell title="个人简介" :value="user.profile" />

    <van-cell title="标签">
      <template #value>
        <div class="tags-container">
          <van-tag v-for="(tag, index) in user.tags" :key="index" plain type="primary">{{ tag }}</van-tag>
        </div>
      </template>
    </van-cell>

    <van-cell title="注册时间" :value="user.createTime" />



    <div class="button-container">
      <div v-if="!isFans && (user.id != loginUser.id)" @click="followUser">
        <van-button round block type="primary" native-type="submit">
          关注
        </van-button>
      </div>
      <div v-else-if="isFans && (user.id != loginUser.id)" @click="toSendMessage">
        <van-button round plain block type="primary" native-type="submit">
          发信息
        </van-button>
      </div>
      <div v-if="isFans && (user.id != loginUser.id)" @click="unFollowUser">
        <van-button round plain block type="warning" native-type="submit">
          取消关注
        </van-button>
      </div>
    </div>
  </template>
  <template v-else>
    <van-empty description="未能加载用户信息" />
  </template>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import {useRoute, useRouter} from "vue-router";
import { useStore } from "vuex";
import myAxios from "../plugins/myAxios";
import { genderEnum } from "../constants/user";
import avatar from "../assets/avatar.png";
import { Dialog, Toast } from "vant";
import { getCurrentUserState } from "../states/user";

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

// Vue 路由、Vuex 存储和状态
const route = useRoute();
const store = useStore();
const loginUser = getCurrentUserState();

// 当前用户信息
const user = ref<User | null>(null);

// 加载状态、粉丝数、关注数、是否已关注
const loading = ref(true);
const followCount = ref(0);
const fanCount = ref(0);
const isFans = ref(false);
const router = useRouter();

// 获取用户数据
const loadUser = async () => {
  try {
    const userId = route.query.id;
    if (!userId) {
      throw new Error("用户 ID 缺失");
    }

    const response = await myAxios.get(`/user/info?userId=${userId}`);
    const userData = response.data;

    if (typeof userData.tags === "string") {
      userData.tags = JSON.parse(userData.tags); // 解析 JSON 字符串
    }

    user.value = userData;
    await getFans();
    await getFollows();
    await isFollow();
  } catch (err) {
    Toast.fail(err.message || "加载用户信息时出错");
  } finally {
    loading.value = false;
  }
};

// 获取粉丝数
const getFans = async () => {
  const id = user.value?.id;
  const res = await myAxios.get(`/user/fans/${id}`);
  if (res?.code === 0) {
    fanCount.value = res.data;
  } else {
    Toast.fail("获取粉丝数失败" + res?.description);
  }
};

// 获取关注数
const getFollows = async () => {
  const id = user.value?.id;
  const res = await myAxios.get(`/user/follows/${id}`);
  if (res?.code === 0) {
    followCount.value = res.data;
  } else {
    Toast.fail("获取关注数失败" + res?.description);
  }
};

// 判断是否已关注
const isFollow = async () => {
  const id = user.value?.id;
  const res = await myAxios.get(`/user/isfans/${id}`);
  if (res?.code === 0) {
    isFans.value = res.data;
  } else {
    Toast.fail("判断失败" + res?.description);
  }
};

// 关注用户
const followUser = async () => {
  Toast.loading({ message: "操作中...", forbidClick: true });
  const id = user.value?.id;
  const res = await myAxios.post(`/user/dofollow/${id}`);
  if (res?.code === 0) {
    isFans.value = true;
    fanCount.value += 1;
    Toast.success("关注成功");
  } else {
    Toast.fail("关注失败" + res?.description);
  }
};

// 取消关注用户
const unFollowUser = () => {
  Dialog({
    title: "提示",
    message: "确认取消关注该用户吗？",
  })
      .then(async () => {
        Toast.loading({ message: "操作中...", forbidClick: true });
        const id = user.value?.id;
        const res = await myAxios.post(`/user/unfollow/${id}`);
        if (res?.code === 0) {
          isFans.value = false;
          fanCount.value -= 1;
          Toast.success("已取消关注");
        }
      })
      .catch(() => {
        Toast.fail("取消操作");
      });
};

// 跳转到发送信息页
const toSendMessage = () => {
  store.commit("updateChatUserId", user.value);
  router.push("/chat/private");
};

onMounted(() => {
  loadUser();
});
</script>
<style scoped>
@import "../assets/css/userShow.css";
@import "../assets/css/public.css";

.center {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.img {
  width: 10rem;
  height: 10rem;
  border-radius: 25%;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.button-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 20px;
  padding-right: 20px;
}

.centered-container {
  display: flex;
  justify-content: center;
}

.small-text {
  font-size: 15px;
  color: #333;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
