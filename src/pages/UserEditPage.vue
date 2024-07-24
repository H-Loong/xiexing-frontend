<template>
  <van-form @submit="onSubmit">
    <van-field
        v-if="editUser.editKey !== 'gender'&&'avatarUrl'"
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
    />

    <van-field
        v-if="editUser.editKey === 'gender'"
        v-model="genderEnum[editUser.currentValue]"
        is-link
        readonly
        :label="editUser.editName"
        placeholder="选择成功，点击提交!"
        @click="showPicker = true"
    />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
          :columns="genderOptions"
          @cancel="showPicker = false"
          @confirm="onGenderConfirm"
      />
    </van-popup>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>


<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";
import {genderEnum} from "../constants/user";

const route = useRoute();
const router = useRouter();

const editUser = ref({
  editKey: route.query.editKey as string,
  currentValue: route.query.currentValue as string,
  editName: route.query.editName as string,
});

const showPicker = ref(false);

const genderOptions = [
  {text: '男', value: 0},
  {text: '女', value: 1},
];

const onGenderConfirm = (selectedOption: { text: string; value: number }) => {
  showPicker.value = false;
  editUser.value.currentValue = selectedOption.text;
};

const onSubmit = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  let submitValue = editUser.value.currentValue;
  if (editUser.value.editKey === 'gender') {
    submitValue = editUser.value.currentValue === '女' ? 1 : 0;
  }

  try {
    const res = await myAxios.post('/user/update', {
      id: currentUser.id,
      [editUser.value.editKey as string]: submitValue,
    });

    if (res.code === 0 && res.data) {

      Toast.success('更新成功');
      await router.push('/user/update')
    } else {
      Toast.fail('更新失败');
      router.back(); // 返回上一级页面
    }
  } catch (error) {
    Toast.fail('请求失败');
  }
};
</script>


<style scoped>
</style>
