
<template>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length === 0">请选择标签</div>
  <van-row gutter="16" style="padding: 0 16px">
    <van-col v-for="tag in activeIds" :key="tag">
      <van-tag closeable size="small" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
  <div style="padding: 12px">
    <van-button block type="primary" @click="doUpdateResult">修改</van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserTagsList from '../constants/UserTagsList';
import myAxios from '../plugins/myAxios';
import { getCurrentUser } from '../services/user';
import { Toast } from 'vant';

const router = useRouter();

const UpdateText = ref('');

// 标签列表
let tagList = ref(UserTagsList);

/**
 * 搜索过滤
 * @param val
 */
const onUpdate = (val) => {
  tagList.value = UserTagsList.map((parentTag) => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = { ...parentTag };
    tempParentTag.children = tempChildren.filter((item) =>
        item.text.includes(UpdateText.value)
    );
    return tempParentTag;
  });
};
const onCancel = () => {
  UpdateText.value = '';
  tagList.value = UserTagsList;
};

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

// 移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter((item) => {
    return item !== tag;
  });
};

/**
 * 执行搜索
 */
const doUpdateResult = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }
    const response = await myAxios.post('/user/updateTags', {
      userId: currentUser.id,
      tags: activeIds.value,
    });
    if (response.data.code === null) {
      Toast.fail('标签更新失败');
    } else {
      Toast.success('标签更新成功');
      await router.push('/user/update')
    }

};
</script>

<style scoped>
</style>
