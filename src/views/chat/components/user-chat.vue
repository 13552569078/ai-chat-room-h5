<template>
  <div class="user-chat-wrap">
    <span>{{chat?.question}}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  chat: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>
  <style lang="scss" scoped>
.user-chat-wrap {
  display: flex;
  justify-content: right;
  align-items: center;
  margin: 20px 0;

  span {
    padding: 16px;
    background: #d0ebff;
    border-radius: 12px 0px 12px 12px;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    width: auto;
  }
}
</style>
