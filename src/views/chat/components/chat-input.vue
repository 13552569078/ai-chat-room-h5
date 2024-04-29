<template>
  <div :class="['footer-wrap', userPhone && 'footer-wrap-user']">
    <div class="left-wrap" v-if="userPhone">
      <img :src="HistorySvg" class="cursor-pointer" @click="getHistoryList">
    </div>
    <div class="right-wrap">
      <van-field center placeholder="请输入想咨询的内容…" v-model.trim="sendMsg">
        <template #button>
          <div class="send-wrap">
            <img :src="ChatSvg" :class="['cursor-pointer', !sendMsg && 'disabled-btn']" @click.stop="sendMsgFn">
          </div>
        </template>
      </van-field>
    </div>

    <van-popup v-model:show="historyShow" position="bottom" overlay-class="overlay-history">
      <div class="history-wrap">
        <div class="item-wrap">
          <span class="empty" v-if="!historyList.length">暂无会话记录</span>
          <div class="item" v-for="(item, index) in historyList" :key="index" :class="conversationId===item.conversationId?'select-chat':null" @click="changeChat(item)">
            <img :src="getIcon(index)" class="icon">
            <div class="item-con">
              <div class="text">{{ item.conversationTitle }}</div>
              <img :src="CloseSvg" class="close" @click="delHistory(item)">
            </div>
          </div>
        </div>
        <div :class="['new-chat', historyList.length === 3 && 'new-chat-disabled']" @click="newChat">创建新会话 </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showConfirmDialog } from "vant";
import ChatSvg from "@/assets/images/ai/chatsend.svg";
import HistorySvg from "@/assets/images/ai/history.svg";
import Icon1Svg from "@/assets/images/ai/icon1.svg";
import Icon2Svg from "@/assets/images/ai/icon2.svg";
import Icon3Svg from "@/assets/images/ai/icon3.svg";
import CloseSvg from "@/assets/images/ai/close.svg";
import { AiApiObj } from "@/apis/modules/ai";
import { IHistoryDictSpace } from "@/apis/modules/ai/model";

const props = defineProps({
  type: {
    type: String,
    default: "SEND_INPUT",
  },
  userPhone: {
    type: String,
    default: "",
  },
  userName: {
    type: String,
    default: "",
  },
  // conversationId 判断当前的会话id 如果删除选中的id 等同于新建会话，否则直接删除
  conversationId: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(['inputSend', 'createNewChat', 'getHistoryByConversationId']);

const sendMsg = ref("");
const sendMsgFn = () => {
  // 回答中不允许重复提问
  if (!sendMsg.value) return;
  // 输入问答1
  emits('inputSend', sendMsg.value, props.type, "");
};

// 历史记录
const historyShow = ref(false);
const historyList = ref<IHistoryDictSpace.Data[]>([]);
const getHistoryList = async () => {
  const { data } = await AiApiObj.postHistoryApi(props.userPhone);
  historyList.value = data;
  historyShow.value = true;
};

// 创建新会话
const newChat = () => {
  if (historyList.value.length === 3) {
    showConfirmDialog({
      message: "最多允许存在三组会话，请先删除多余会话记录",
    });
  } else {
    // 新建成功
    emits('createNewChat');
    historyShow.value = false;
  }
};
// 切换会话
const changeChat = (item:IHistoryDictSpace.Data) => {
  // 同个id则 不处理
  if (item.conversationId === props.conversationId) return false;
  emits('getHistoryByConversationId', item.conversationId);
  historyShow.value = false;
};

// 删除会话
const delHistory = (row:IHistoryDictSpace.Data) => {
  showConfirmDialog({
    message: `是否确认删除【${row.conversationTitle}】此条会话记录，删除不可恢复?`,
  })
    .then(async () => {
      await AiApiObj.getDelHistoryApi({
        phone: row.phone,
        conversationId: row.conversationId
      });
      // 重置记录
      getHistoryList();
      row.conversationId === props.conversationId && emits('createNewChat');
    });
};

// 获取icon图标
const getIcon = (index: number) => {
  if (index === 0) return Icon1Svg;
  if (index === 1) return Icon2Svg;
  if (index === 2) return Icon3Svg;
  return Icon1Svg;
};
defineExpose({ sendMsg });
</script>
<style scoped lang="scss">
:deep(.van-field) {
  border-radius: 10px 10px 0px 0px;
}

.footer-wrap {
  background-color: #ffffff;
  box-shadow: 0 -10px 10px rgba(41, 48, 64, 0.0588);
  border-radius: 10px 10px 0px 0px;
  display: flex;

  &.footer-wrap-user {
    padding-left: 20px;
  }

  .left-wrap {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .right-wrap {
    flex: 1;

    .send-wrap {
      display: flex;
      align-items: center;
      height: 100%;

      .disabled-btn {
        filter: opacity(0.5);
      }
    }
  }
}

.history-wrap {
  padding: 32px 16px;

  .item-wrap {
    .item {
      display: flex;
      height: 60px;
      margin-bottom: 20px;
      width: 100%;

      .icon {
        margin-right: 10px;
        width: 40px;
      }

      .item-con {
        display: flex;
        flex: 1;
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #E4E9ED;

        .text {
          font-size: 16px;
          font-weight: bold;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 20px;
        }

        .close {
          width: 18px;
        }
      }
      &.select-chat{
        .item-con{
          color: #1483FE;
        }
      }
    }
    .empty{
      display: flex;
      font-size: 14px;
      padding: 10px 30px 20px;
      justify-content: center;
      align-items: center;
    }
  }

  .new-chat {
    height: 44px;
    display: flex;
    border-radius: 12px;
    display: flex;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: #1483FE;

    &.new-chat-disabled {
      background: #BDBDBD;
    }
  }
}

// 修改弹框样式
:deep(.van-popup) {
  border-radius: 12px 12px 0px 0px;
}
// 解决input居中问题
:deep(.van-field__control) {
  height: 36px;
}
</style>
