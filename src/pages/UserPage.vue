<template>
  <div style="padding-top: 5px"></div>
  <div v-if="user">
    <div class="center">
      <van-uploader :after-read="afterRead"
                    :max-count="1"
                    :max-size="5000 * 1024"
                    @oversize="onOversize">
        <div>
          <img :alt="user?.username" class="img" :src="user?.avatarUrl || avatar" />
        </div>
      </van-uploader>
    </div>
    <div style="padding-top: 15px"></div>
    <van-cell title="当前用户" :value="user?.username" />
    <van-cell title="修改信息" is-link to="/user/update" />
    <van-cell title="粉丝列表" is-link to="/user/fans" />
    <van-cell title="关注列表" is-link to="/user/followers" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />
    <div class="button-container">
      <van-button type="default" size="large" icon-position="" is-link to="/user/login">切换账号</van-button>
      <van-button type="default" size="large" icon-position="" @click="logout">退出</van-button>
    </div>
  </div>
  <div v-else>
    <van-loading type="spinner" size="30px">加载中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast,} from "vant";
import {getCurrentUser} from "../services/user";
import { Notify } from 'vant';
import avatar from '../assets/avatar.png'

const user = ref();
const updateAvatarUrl = ref(false)
const router = useRouter();

onMounted(async () => {
  user.value = await getCurrentUser();
  Notify({ type: 'primary', message: '点击头像可以更换头像', duration: 1500 });
});

const afterRead = async (file: any) => {
  updateAvatarUrl.value = true;
  if (updateAvatarUrl.value) {
    const fileFile = file.file;
    const res = await myAxios.post("/user/upload", {
      'file': fileFile,
      id: user.value.id
    }, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    if (res.data.code !== null){
      Toast.success("更新成功！");
      user.value.avatarUrl = res.data.avatarUrl; // 更新头像URL
    } else {
      Toast.fail("更新失败！");
    }
  }
};

const onOversize = () => {
  Toast.fail("头像上传大小不能超过5MB");
};

const logout = async () => {
  try {
    const response = await myAxios.post('/user/logout');
    if (response.data === 1) {
      Toast.success('退出成功');
      router.push('/');
    } else {
      Toast.fail('退出失败');
    }
  } catch (error) {
    Toast.fail('退出失败');
  }
};
</script>

<style scoped>
@import "../assets/css/userShow.css";
@import "../assets/css/public.css";

.button-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.van-popup--center) {
  max-width: none;
  border-radius: 5%;
}
</style>
