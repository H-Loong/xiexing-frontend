<!-- 用户私聊页 -->
<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messageList">
      <van-cell-group>
        <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', { 'message--self': message.senderId === loginUser.id }]"
        >
          <div
              v-if="message.senderId !== loginUser.id"
              class="avatar-container"
              @click="onAvatarClick"
          >
            <img class="avatar" :src="message.avatar" alt="avatar"/>
          </div>
          <div
              v-else
              class="avatar-container"
          >
            <img class="avatar" :src="loginUser.avatarUrl" alt="avatar"/>
          </div>
          <div class="message-content-container">
            <div class="message-content">
              <div class="message-text">{{ message.message }}</div>
            </div>
            <!-- 仅在最后一条消息显示时间戳 -->
            <div v-if="index === messages.length - 1" class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <div class="chat-input">
      <van-field
          v-model="newMessage"
          @keypress.enter="sendMessage"
          clearable
          class="input-field"
      />
      <van-button type="primary" @click="sendMessage">↗</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {getCurrentUser} from '../services/user';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const route = useRoute();
const store = useStore();
const router = useRouter();

const currentUser = ref();
const chatUserId = ref(store.state.chatUserId.id);
const loginUser = ref(null);
const ws = ref<WebSocket | null>(null); // WebSocket 连接
const isWsConnected = ref(false); // WebSocket 连接状态

onMounted(async () => {
  await getChatUser(); // 获取当前聊天用户对象
  loginUser.value = await getCurrentUser();
  await fetchChatHistory(); // 加载历史消息记录
  const friendName = route.params.friendName as string;
  if (friendName) {
    scrollToBottom();
  }

  // 连接 WebSocket
  ws.value = new WebSocket('ws://118.25.182.13:8080/api/chat');
  ws.value.onopen = () => {
    isWsConnected.value = true; // WebSocket 连接建立成功
  };
  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if ((message.senderId === loginUser.value?.id && message.receiverId === chatUserId.value)
        || (message.receiverId === loginUser.value?.id && message.senderId === chatUserId.value)) {
      messages.value.push(message);
    }
    scrollToBottom();
  };

  ws.value.onclose = () => {
    isWsConnected.value = false;
  };
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

interface Message {
  senderId: number; // 发送者id
  receiverId: number; // 接收者id
  message: string; // 消息内容
  timestamp: string; // 发送时间
  avatar: string; // 头像url
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const messageList = ref<HTMLElement | null>(null);

/**
 * 发送消息
 */
const sendMessage = () => {
  console.log(isWsConnected.value)

  if (newMessage.value.trim() && isWsConnected.value && ws.value) {
    const message = {
      senderId: loginUser.value.id,
      receiverId: chatUserId.value,
      message: newMessage.value,
      timestamp: new Date().toISOString(), // 使用 ISO 格式的时间戳
      avatar: loginUser.value.avatarUrl,
    };
    ws.value.send(JSON.stringify(message));
    messages.value.push(message);
    newMessage.value = '';
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  });
};

/**
 * 日期格式转换
 * @param timestamp
 */
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formattedDate
};

/**
 * 点击用户头像跳转到用户详情页
 */
const onAvatarClick = () => {
  const id = store.state.chatUserId.id;
  router.push({ path: '/user/show', query: { id } });
};

/**
 * 获取历史聊天记录
 */
const fetchChatHistory = async () => {
  const senderId = store.state.chatUserId.id;
  console.log(senderId)
  const res = await myAxios.get(`chat/history/${senderId}`);
  if (res?.code === 0) {
    messages.value = res.data; // 确保这里返回的消息数据是有效的
    scrollToBottom();
  } else {
    Toast.fail('加载历史消息失败' + res?.description);
  }
}

/**
 * 获取当前私聊用户对象
 */
const getChatUser = async () => {
  const userId = store.state.chatUserId.id;
  const res = await myAxios.get(`/user/info?userId=${userId}`);
  if (res?.code === 0) {
    if (res?.data) {
      res.data.tags = JSON.parse(res.data.tags); // 解析后端返回的json字符串
    }
    currentUser.value = res.data;
  } else {
    Toast.fail('加载用户信息失败' + res?.description)
  }
}
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 85vh; /* 将高度改为 85vh */
  background-color: #ffffff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #ffffff;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.message--self {
  flex-direction: row-reverse;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.message-content-container {
  display: flex;
  flex-direction: column; /* 确保消息内容和时间戳垂直排列 */
  align-items: flex-start;
  max-width: 70%;
}

.message--self .message-content-container {
  align-items: flex-end; /* 当前用户发送的消息对齐右边 */
}

.message-content {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message--self .message-content {
  background-color: #b0e57c; /* 将当前用户消息背景颜色设置为绿色 */
}

.message-text {
  margin-bottom: 5px;
}

.message-time {
  font-size: 0.75rem;
  color: #888;
  align-self: flex-end; /* 使时间戳在消息框的外部，并右对齐 */
}

.chat-input {
  display: flex;
  height: 40px;
  padding: 10px;
  background-color: #f7f7f7;
  position: sticky;
}

.input-field {
  flex: 1;
  margin-right: 10px;
  background-color: #ffffff;
  border-radius: 20px;
  padding-left: 10px;
}

.van-field__control {
  background-color: transparent !important;
}
</style>
