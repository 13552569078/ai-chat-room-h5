<template>
  <div class="ai-talk-wrap ai-talk-wrap1">
    <pre>{{ chat?.responseStr }}</pre>
    <div class="deliver"></div>
    <div class="tags-wrap">
      <div
        class="tags-item"
        v-for="(item, idx1) in chat?.recommend?.content"
        :key="idx1"
        @click="handleSend(item)"
      >
        {{ item }}
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
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  .tags-item {
    color: #1483fe;
    border-radius: 4px;
    padding: 4px 12px;
    border-radius: 4px;
    background: rgba(20, 121, 254, 0.09);
  }
}
</style>
