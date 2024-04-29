<template>
  <div class="ai-wrap">
    <div class="ai-con-wrap">
      <div class="content-scroll" id="content-scroll">
        <!-- 默认聊天 -->
        <Defaultchat></Defaultchat>
        <div v-for="(chatItem, index) in responseList" :key="index">
          <Userchat :chat="chatItem"></Userchat>
          <!-- 纯文字 -->
          <ChatAi1 v-if="chatItem?.recommend?.type === 1" @changeFeedBackStatus="chatItem.feedbackStatus = true"
            :chat="chatItem"></ChatAi1>
          <!-- 文字点选 -->
          <ChatAi2 v-if="chatItem?.recommend?.type === 2" :chat="chatItem" :type="SEND_CLICK"
            @clickSend="pushResponseListMainTalk" @changeFeedBackStatus="chatItem.feedbackStatus = true"></ChatAi2>
          <!-- 3详情地址等 -->
          <ChatAi3 v-if="chatItem?.recommend?.type === 3" :chat="chatItem" :type="SEND_CLICK"
            @clickSend="pushResponseListMainTalk" @changeFeedBackStatus="chatItem.feedbackStatus = true"></ChatAi3>
          <!-- 层级 -->
          <ChatAi4 v-if="chatItem?.recommend?.type === 4" :chat="chatItem" :type="SEND_CLICK"
            @clickSend="pushResponseListMainTalk" @changeFeedBackStatus="chatItem.feedbackStatus = true"></ChatAi4>
        </div>
        <ChatLoading v-if="loading"></ChatLoading>
      </div>
    </div>
    <div class="footer-wrap">
      <ChatInput @inputSend="pushResponseListMainTalk" @createNewChat="createNewChat" @getHistoryByConversationId="getHistoryByConversationId" ref="chatInputRef" type="{SEND_INPUT}" :userPhone="userPhone"
        :userName="userName" :conversationId="conversationId"></ChatInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { AiApiObj } from "@/apis/modules/ai";
import { useRoute } from "vue-router";
import {
  Defaultchat,
  Userchat,
  ChatAi1,
  ChatAi2,
  ChatAi3,
  ChatAi4,
  ChatInput,
  ChatLoading,
} from "./components/index";
import { showConfirmDialog } from "vant";

import { mapChatoneortwo, mapChatThree, mapChatfour } from "@/utils";

const SEND_INPUT = "SEND_INPUT";
const SEND_CLICK = "SEND_CLICK";

const route = useRoute();

// 每次的会话唯一标识
const uuid = ref("");
// input ref实例
const chatInputRef = ref();
// 加载中
const loading = ref(false);
// 能否滚动 解决弹框音影响
const canScroll = ref(true);
// 最新的会话id
const conversationId = ref("");

// 问答list question answer 每个问答一组
// recommend为下拉点击的推荐
const responseList = ref<any[]>([]);

// URl中的初始化消息
// const initSendMsg = computed(() => {
//   return (route.query?.message as string) || "";
// });
// 判断是否是手机号 不是等同于未传递
const isValidPhoneNumber = (phoneNumber:string) => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
};
const userPhone = computed(() => {
  return isValidPhoneNumber((route.query?.phone as string)) ? (route.query?.phone as string) : "";
});
const userName = computed(() => {
  return isValidPhoneNumber((route.query?.name as string)) ? (route.query?.name as string) : "";
});

const handelFresh = async (data: any) => {
  showConfirmDialog({
    message: "检测到您的聊天主题发生了改变,请问是否开启新的聊天？",
  })
    .then(() => {
      pushResponseListMainTalk("开始新的咨询", SEND_INPUT, "");
    })
    .catch(() => {
      pushResponseListMainTalk("继续之前的咨询", SEND_INPUT, "");
    });
};
const handelSwitch = async (data: any) => {
  showConfirmDialog({
    message: "检测到您在询问新的事项，是否切换新的事项？",
  })
    .then(() => {
      pushResponseListMainTalk("切换", SEND_INPUT, "");
    })
    .catch(() => {
      pushResponseListMainTalk("不切换", SEND_INPUT, "");
    });
};

// type: sendType === SEND_INPUT ? "1" : "0",  type: 0-点选，1-文本输入
// 添加提问输入 输入id为空  点击未回答id
const pushResponseListMainTalk = async (
  question: string,
  type: string,
  id: string
) => {
  responseList.value.push({
    question,
  });
  const sendType = type === SEND_INPUT ? "1" : "0";
  try {
    // 加载中
    loading.value = true;
    // 输入框置空
    chatInputRef.value.sendMsg = "";

    scrollToBottom();

    const { data } = await AiApiObj.getAiMsg({
      sessionId: uuid.value,
      id,
      type: sendType,
      content: question,
      phone: userPhone.value,
      name: userName.value,
      conversationId: conversationId.value
    });
    const recommend = JSON.parse(data.recommend);

    // 默认反馈为false
    data.feedbackStatus = false;

    // 每次会话获取最新的会话id
    conversationId.value = data.conversationId;
    // 处理类型1：直接返回文本  2文本有 点选
    if (recommend.type === 1 || recommend.type === 2) {
      // 最后一个节点 添加回答数据
      responseList.value[responseList.value.length - 1] = {
        ...responseList.value[responseList.value.length - 1],
        ...mapChatoneortwo(data),
      };
    }

    // 层级展示
    if (recommend.type === 3) {
      // 最后一个节点 添加回答数据
      responseList.value[responseList.value.length - 1] = {
        ...responseList.value[responseList.value.length - 1],
        ...mapChatThree(data),
      };
    }

    // 层级展示
    if (recommend.type === 4) {
      // 最后一个节点 添加回答数据
      responseList.value[responseList.value.length - 1] = {
        ...responseList.value[responseList.value.length - 1],
        ...mapChatfour(data),
      };
    }

    scrollToBottom();
    // 加载完成
    loading.value = false;

    // 刷新话题  当前版本去除切换话题的处理
    // if (data.nodeType === "end") {
    //   handelFresh(data);
    // } else if (data.nodeType === "tree_judge") {
    //   // 切换话题
    //   handelSwitch(data);
    // }
  } catch {
    loading.value = false;
  }
};

const getUuid = async () => {
  const { data } = await AiApiObj.getUuid();
  uuid.value = data;
};

const createNewChat = () => {
  // 新话题则需要 清空id 并且清空历史记录
  conversationId.value = '';
  responseList.value = [];
};

// 获取最新的历史记录
const getLatestConversationId = async () => {
  const { data } = await AiApiObj.getHistoryLatest(userPhone.value);
  conversationId.value = data?.conversationId || '';
};
// 获取历史记录并数据处理
const getHistoryByConversationId = async(id:string) => {
  // 没有回话id 则不处理
  if (!id) return;
  const { data } = await AiApiObj.getHistorybyId({ conversationId: id, phone: userPhone.value });
  // 切换会话 则更改当前会话id;
  conversationId.value = id;

  responseList.value = data.map((item:any) => {
    const recommend = JSON.parse(item.recommend);
    // 处理字段对应关系
    item.question = item.requestContent;
    item.responseStr = item.responseContent;
    item.feedbackStatus = item.isComment;

    if (recommend.type === 1 || recommend.type === 2) {
      return {
        ...item,
        ...mapChatoneortwo(item),
      };
    }
    if (recommend.type === 3) {
      return {
        ...item,
        ...mapChatThree(item),
      };
    }
    if (recommend.type === 4) {
      return {
        ...item,
        ...mapChatfour(item),
      };
    }
    return item;
  });
  nextTick(() => {
    scrollToBottom('auto');
  });
};

onMounted(async () => {
  // 获取uuid
  if (!userPhone.value) {
    await getUuid();
  } else {
    await getLatestConversationId();
    await getHistoryByConversationId(conversationId.value);
  }
  // 此处获取历史记录
  // 初始化提问 隐藏初始化提问逻辑 业务目前无此逻辑
  // initSendMsg.value &&
  //   pushResponseListMainTalk(initSendMsg.value as string, SEND_INPUT, "");
});

// 滚动底部
const scrollToBottom = (behavior = "smooth") => {
  nextTick(() => {
    const dom = document.getElementById("content-scroll") as any;
    const height = dom.scrollHeight;
    dom.scrollTo({ top: height, left: 0, behavior });
  });
};
// 安卓ios 键盘收起事件
window.addEventListener("resize", () => {
  const newInnerHeight = window.innerHeight;
  if (!(innerHeight > newInnerHeight)) {
    // 键盘收起事件处理
    canScroll.value && scrollToBottom();
  }
});
window.addEventListener("focusout", () => {
  // 键盘收起事件处理
  canScroll.value && scrollToBottom();
});

// 业务逻辑
// 1：有userPhone 获取初始化历史列表，并组装数据  有记录则需要传递最新的 conversationId   无conversationId每次会话则会新增一个会话记录

</script>
<style lang="scss">
.ai-wrap {
  width: 100%;
  height: 100%;
  // border: 1px solid black;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  display: flex;

  .ai-con-wrap {
    overflow: hidden;
    flex: 1;
    background-image: url("@/assets/images/ai/top-bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-color: #f1fcff;
    height: 100%;
    overflow: hidden;

    .content-scroll {
      padding: 12px 12px 0;
      height: 100%;
      overflow: auto;
    }
  }

  .footer-wrap {
    height: 55px;
    width: 100%;
    bottom: 0;
  }
}

// 全部的pre设置
pre {
  font-size: 14px;
  white-space: pre-wrap;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #404040;
  line-height: 26px;
  text-indent: 0;
}

// Ai 对话框样式
.ai-talk-wrap {
  justify-content: left;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0px 12px 12px 12px;
  padding: 16px;
  margin: 20px 0;
}

// 分割
.deliver {
  margin: 16px 0;
  border: 1px solid #ededed;
  width: 100%;
}

.w-full {
  width: 100%;
}

.bold {
  font-weight: bold;
}
</style>
