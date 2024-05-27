<template>
  <van-form @submit="onSubmit">
    <van-field
        v-if="editUser.editKey === 'gender'"
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
    />
    <van-field
        v-if="editUser.editKey !== 'gender'"
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import myAxios from "../plugins/myAxios";
import { Toast } from "vant";
import { getCurrentUser } from "../services/user";

const route = useRoute();
const router = useRouter();

const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
});

// Convert gender value from number to string representation on init
if (editUser.value.editKey === 'gender') {
  editUser.value.currentValue = editUser.value.currentValue === '1' ? '女' : '男';
}

const onSubmit = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  // Convert gender value from string to number representation before submission
  let submitValue = editUser.value.currentValue;
  if (editUser.value.editKey === 'gender') {
    submitValue = editUser.value.currentValue === '女' ? 1 : 0;
  }

  try {
    const res = await myAxios.post('/user/update', {
      id: currentUser.id,
      [editUser.value.editKey as string]: submitValue,
    });

    if (res.data.code === null) {
      Toast.fail('更新失败');
    } else {
      Toast.success('更新成功');
    }
  } catch (error) {
    Toast.fail('请求失败');
  }
};
</script>

<style scoped>
</style>
