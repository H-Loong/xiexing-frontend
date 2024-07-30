<template>
  <div style="padding-top: 5px"></div>
  <template v-if="user">
    <div class="center">
      <van-uploader :after-read="afterRead"
                    :max-count="1"
                    :max-size="5000 * 1024"
                    @oversize="onOversize">
      <div>
      <img :alt="user?.username" class="img" :src="user?. avatarUrl?user. avatarUrl:'src/assets/default.png'">
    </div>
      </van-uploader>
    </div>
    <div style="padding-top: 15px"/>
    <van-cell title="当前用户" :value="user?.username" />
    <van-cell title="修改信息" is-link to="/user/update" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />
    <div class="button-container">
      <van-button type="default" size="large" icon-position="" is-link to="/user/login">切换账号</van-button>
      <van-button type="default" size="large" icon-position="" @click="logout">退出</van-button>
    </div>

  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast,} from "vant";
import {getCurrentUser} from "../services/user";
import { Notify } from 'vant';


const user = ref();
const updateAvatarUrl = ref(false)
const router = useRouter();

onMounted(async () => {
  user.value = await getCurrentUser();

  Notify({ type: 'primary', message: '点击头像可以更换头像',  duration: 1500});
})
const afterRead = async (file: any) => {
  updateAvatarUrl.value = true
  if (updateAvatarUrl.value) {
    const fileFile = file.file
    const res = await myAxios.post("/user/upload", {
      'file': fileFile,
      id: user.value.id
    }, {
      headers: {'Content-Type': 'multipart/form-data'},
    })

    if (res.data.code !== null){
      Toast.success("更新成功！")
    }else{
      Toast.fail("更新失败！")
    }

}}
const onOversize = () => {
  Toast.fail("头像上传大小不能超过500kb")
}

const logout = async () => {
  try {
    const response = await myAxios.post('/user/logout');
    if (response.data === 1) { // 确保检查后端返回的成功状态码
      Toast.success('退出成功');
      router.push('/'); // 重定向到登录页面
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
  margin-top: 20px; /* 与上方内容保持一定距离 */
  display: flex;
  flex-direction: column;
  gap: 10px; /* 按钮之间的距离 */
}

:deep(.van-popup--center) {
  max-width: none;
  border-radius: 5%;
}

</style>
