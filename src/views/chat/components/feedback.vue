<template>
  <div class="feedback-wrap">
    <div class="feedback-btn" :class="talkCard.feedbackStatus ? 'disabled' : null" @click="showFeedBackDialog"
      @close="close" @cancel="close">我要反馈</div>
    <!-- 评分 -->
    <van-dialog v-model:show="showFeedBack" title="意见反馈" show-cancel-button confirmButtonText="提交" @confirm="submit">
      <div class="con-wrap">
        <div class="top">
          <div class="label item-center bold">我要反馈</div>
          <div class="btn-wrap">
            <div class="btn-item" :class="correctAnswer === '0' ? 'active' : null" @click="changeType('0')">回答正确</div>
            <div class="btn-item" :class="correctAnswer === '1' ? 'active' : null" @click="changeType('1')">回答错误</div>
          </div>
        </div>
        <div class="deliver"></div>
        <div class="star-wrap">
          <div class="star-item">
            <div class="label item-center bold">准确性</div>
            <div class="star">
              <van-rate v-model="accuracy" :size="22" color="#F6BB06" void-icon="star" void-color="#CACFD6"
                style="--van-rate-icon-gutter:12px;" />
            </div>
          </div>
          <div class="star-item">
            <div class="label item-center bold">完整性</div>
            <div class="star">
              <van-rate v-model="integrity" :size="22" color="#F6BB06" void-icon="star" void-color="#CACFD6"
                style="--van-rate-icon-gutter:12px;" />
            </div>
          </div>
          <div class="star-item">
            <div class="label item-center bold">友好性</div>
            <div class="star">
              <van-rate v-model="friendliness" :size="22" color="#F6BB06" void-icon="star" void-color="#CACFD6"
                style="--van-rate-icon-gutter:12px;" />
            </div>
          </div>
        </div>
        <div class="deliver"></div>
        <div class="opinionContent">
          <van-field v-model="opinionContent" label="展开说说" type="textarea" maxlength="300" placeholder="展开说说"
            label-align="top" style="--van-cell-vertical-padding:0;--van-cell-horizontal-padding:0" rows="3"
            show-word-limit />
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, nextTick, watch } from "vue";
import { Dialog, Divider, Rate } from 'vant';
import { AiApiObj } from "@/apis/modules/ai";

const emit = defineEmits(['feedBack', 'handleScrollBottom']);

const props = defineProps({
  talkCard: {
    type: Object as any,
    default: () => {
      return {};
    }
  },
});

const showFeedBack = ref(false);
const correctAnswer = ref('0'); // 0 正确  1 错误
const accuracy = ref(5); // 准确性
const integrity = ref(5); // 完整性
const friendliness = ref(5); // 友好性
const opinionContent = ref(''); // 备注

const changeType = (type: string) => {
  correctAnswer.value = type;
};

const showFeedBackDialog = () => {
  correctAnswer.value = '0';
  accuracy.value = 5;
  integrity.value = 5;
  friendliness.value = 5;
  opinionContent.value = '';
  showFeedBack.value = true;
  emit('handleScrollBottom', false);
};

const close = () => {
  emit('handleScrollBottom', true);
};
const submit = async () => {
  const { data } = await AiApiObj.postStar({
    responseId: props.talkCard?.responseId,
    correctAnswer: correctAnswer.value,
    accuracy: accuracy.value,
    integrity: integrity.value,
    friendliness: friendliness.value,
    opinionContent: opinionContent.value
  });
  showFeedBack.value = false;
  emit('feedBack');
  emit('handleScrollBottom', true);
};

</script>
<style lang="scss" scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-center {
  display: flex;
  align-items: center;
}

.bold {
  font-weight: bold;
}

.deliver {
  margin: 16px 0 16px;
  border: 1px solid #ededed;
}

.feedback-wrap {
  width: 100%;
  border-top: 1px solid #ededed;
  margin-top: 16px;
  font-size: 14px;
}

.feedback-btn {
  margin-top: 16px;
  width: 100%;
  height: 24px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #404040;
  line-height: 16px;
  border: 1px solid #EDEDED;

  &.disabled {
    pointer-events: none;
    background: #FAFAFA;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #9B9B9B;
    line-height: 16px;
  }
}

.con-wrap {
  padding: 20px;
  background: #ffffff;

  .top {
    display: flex;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #404040;
    line-height: 20px;
    width: 100%;

    .label {
      width: 70px;
    }

    .btn-wrap {
      flex: 1;
      display: flex;
      justify-content: space-around;

      .btn-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 18px;
        background: #F9F9F9;
        border-radius: 4px;

        &.active {
          background: rgba(20, 121, 254, 0.09);
          border-radius: 4px;
          color: #1483FE;
        }
      }
    }
  }

  .star-wrap {
    display: flex;
    flex-direction: column;
    font-size: 14px;

    .star-item {
      display: flex;

      &:not(:last-child) {
        margin-bottom: 16px;
      }

      .label {
        width: 70px;
        font-size: 14px;
        justify-content: left;
      }

      .star {
        flex: 1;
        display: flex;
        justify-content: left;
      }
    }
  }
}

:deep(.van-field__label) {
  font-weight: bold;
  font-size: 15px;
}

:deep(.van-field__body) {
  background: #F9F9F9;
  border-radius: 4px;
  padding: 10px
}
</style>
