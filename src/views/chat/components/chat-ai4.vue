<template>
  <div class="ai-talk-wrap ai-talk-wrap4">
    <div class="bold w-full" v-if="chat.response.title">{{
      chat.response.title
    }}</div>
    <div class="deliver" v-if="chat.response.title"></div>
    <!-- true则 流程 -->
    <template v-if="chat.response.secondList.length">
      <div
        class="level-wrap"
        v-for="(itm, index) in chat.response.list"
        :key="index"
      >
        <div class="level1 label" :class="`label-${index}`">
          <div class="icon" v-if="index < 3"></div>
          <div class="icon" v-else>{{ index + 1 }}</div>
          <div class="text bold">{{ itm.substring(2) }}</div>
        </div>
        <div class="level2" v-if="chat.response.secondList[index]">
          <pre> {{ chat.response.secondList[index] }} </pre>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="level-wrap"
        v-for="(itm, index) in chat?.response.list"
        :key="index"
      >
        <div class="level1 label" :class="`label-${index}`">
          <div class="icon" v-if="index < 3"></div>
          <div class="icon" v-else>{{ index + 1 }}</div>
          <div class="text">{{ itm.substring(2) }}</div>
        </div>
      </div>
    </template>
    <!-- 增加处理list为空的乱码标识 -->
    <template v-if="chat?.response.list.length === 0">
      <pre> {{ chat?.responseStr }} </pre>
    </template>
    <div class="deliver" v-if="chat.recommend.content.length"></div>
    <div class="tags-wrap" v-if="chat.recommend.content.length">
      <div
        class="tags-item"
        v-for="(itm, idx1) in chat.recommend.content"
        :key="idx1"
        @click="handleSend(itm)"
      >
        {{ itm }}
      </div>
    </div>
    <!-- 反馈按钮 -->
    <FeedBack
      @feedBack="$emit('changeFeedBackStatus')"
      :talk-card="chat"
    ></FeedBack>
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

const emits = defineEmits(["clickSend", "changeFeedBackStatus"]);

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

.ai-talk-wrap4 {
  display: flex;
  justify-content: left;
  align-items: center;

  .level-wrap {
    width: 100%;
    &:not(:last-child) {
      margin-bottom: 16px;
    }

    .text {
      flex: 1;
      display: flex;
    }

    .level1 {
      display: flex;
      margin-bottom: 8px;
      align-items: center;

      .icon {
        width: 24px;
        height: 24px;
        border-radius: 3px;
        background: #d0ebff;
        margin-right: 8px;
        font-size: 12px;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1483fe;
      }

      &.label-0 {
        .icon {
          width: 24px;
          background: url("@/assets/images/ai/rank1.png") no-repeat;
          background-size: contain;
          margin-right: 8px;
        }
      }

      &.label-1 {
        .icon {
          width: 24px;
          background: url("@/assets/images/ai/rank2.png") no-repeat;
          background-size: contain;
          margin-right: 8px;
        }
      }

      &.label-2 {
        .icon {
          width: 24px;
          background: url("@/assets/images/ai/rank3.png") no-repeat;
          background-size: contain;
          margin-right: 8px;
        }
      }
    }

    .level2 {
      display: flex;
      margin-left: 6px;
      align-items: center;

      .icon {
        width: 6px;
        height: 6px;
        background: pink;
        margin-right: 4px;
      }
    }
  }

  .deliver1 {
    margin: 16px 0 16px;
    border: 1px solid #ededed;
  }
}
</style>
