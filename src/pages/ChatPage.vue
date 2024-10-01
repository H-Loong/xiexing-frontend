<!-- 好友列表页 -->
<template>
  <div class="friend-list-container">
    <van-cell-group v-if="friends.length > 0">
      <van-cell
          v-for="(friend, index) in friends"
          :key="index"
          :title="friend.name"
          :label="friend.status === 1 ? '在线' : '离线'"
          clickable
          @click="openChat(friend)"
      >
        <template #icon>
          <img :src="friend.avatar" class="avatar" />
          <!-- 显示未读消息红点 -->
          <div v-if="friend.hasUnread" class="unread-dot"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-else description="暂无关注用户和粉丝" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import myAxios from '../plugins/myAxios';
import {Toast } from 'vant';
import { useStore } from 'vuex';

interface Friend {
  id: number;
  name: string;
  status: number;
  avatar: string;
  hasUnread: boolean; // 添加是否有未读消息字段
}

const friends = ref<Friend[]>([]);

const router = useRouter();

const store = useStore();

onMounted(async () => {
  await loadingData();
});

/**
 * 加载好友列表
 */
const loadingData = async () => {
  try {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    const res = await myAxios.get('/friends/all');
    if (res?.code === 0 ) {
      Toast.success('加载成功');
      friends.value = res.data;
    } else {
      throw new Error('加载好友列表失败');
    }
  } catch (error) {
    Toast.fail(error.message || '加载好友列表失败');
  }
};

const openChat = (friend: Friend) => {
  store.commit('updateChatUserId', friend); // 更新当前私聊用户id
  router.push('/chat/private');
};
</script>

<style>
.friend-list-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  background-color: #ffffff;
  padding-bottom: 12px; /* 确保底部空间足够，防止被底部布局遮住 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative; /* 相对定位，用于未读消息提示 */
}

.unread-dot {
  position: absolute;
  top: 50%;
  right: 5px; /* 调整位置确保圆点完全显示在右侧 */
  transform: translateY(-50%);
  background-color: red;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
