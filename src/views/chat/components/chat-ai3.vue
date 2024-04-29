<template>
  <div class="ai-talk-wrap ai-talk-wrap3">
    <div class="bold w-full" v-if="chat.response.title">{{
      chat.response.title
    }}</div>
    <div class="deliver" v-if="chat.response.title"></div>
    <div
      class="detail-chat"
      v-for="(itm, index) in chat.response.list"
      :key="index"
    >
      <div class="label bold">{{ itm.label }}</div>
      <div class="label-con" v-for="(itm1, inx1) in itm.list" :key="inx1">
        {{ itm1 }}
      </div>
    </div>
    <div class="deliver" v-if="chat.recommend.content.length"></div>
    <div class="tags-wrap" v-if="chat.recommend.content.length">
      <div
        class="tags-chat"
        v-for="(itm, idx1) in chat.recommend.content"
        :key="idx1"
        @click="handleSend(itm)"
      >
        {{ itm }}
      </div>
    </div>
     <!-- 反馈按钮 -->
     <FeedBack @feedBack="$emit('changeFeedBackStatus')" :talk-card="chat"></FeedBack>
  </div>
</template>

<script setup lang="ts">
import { FeedBack } from "./index";

const props = defineProps({
  chat: {
    type: Object,
    default: () => {
      return {};
    },
  },
  type: {
    type: String,
    default: "SEND_CLICK",
  },
});

const emits = defineEmits(['clickSend', 'changeFeedBackStatus']);

const handleSend = (content: string) => {
  // 选择提问
  emits("clickSend", content, props.type, props.chat.internal);
};
</script>
  <style scoped lang="scss">
.detail-chat {
  .label {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    text-indent: 8px;
    background: linear-gradient(
      to right,
      rgba(20, 131, 254, 0.15),
      rgba(20, 131, 254, 0.05)
    );
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .label-con {
    line-height: 22px;
    margin-left: 8px;
  }
}
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  .tags-chat {
    color: #1483fe;
    border-radius: 4px;
    padding: 4px 12px;
    border-radius: 4px;
    background: rgba(20, 121, 254, 0.09);
  }
}
</style>
