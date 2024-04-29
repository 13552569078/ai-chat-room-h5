<template>
  <div class="ai-talk-wrap ai-talk-wrap1">
    <pre>{{chat?.responseStr}}</pre>
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
});

const emits = defineEmits(['changeFeedBackStatus']);

</script>
