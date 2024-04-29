<template>
  <div class="ai-wrap">
    <div class="content">
      <div class="top-logo">
        <div class="logo"></div>
        <div class="top-con">您好，数智网格员为您服务！</div>
      </div>
      <div class="session-wrap" id="content-scroll">
        <div v-for="(item, idx) in responseList" :key="idx">
          <!-- 自己的谈话 -->
          <div class="main-talk-wrap" v-if="item.talkType === MAIN_TALK">
            <span>{{ item.content }}</span>
          </div>
          <!-- AI回复 -->
          <!-- 1   纯文字 -->
          <div class="ai-talk-wrap ai-talk-wrap1" v-if="item.talkType === AI_TALK && item.recommend.type === 1">
            <span>
              <pre>{{ item.responseStr }}</pre>
            </span>
            <!-- 反馈按钮 -->
            <feed-back v-if="item.talkType === AI_TALK" @feedBack="item.feedbackStatus = true" :talk-card="item"
              @handleScrollBottom="scrollChange"></feed-back>
          </div>
          <!-- 2   文字和卡片 -->
          <div class="ai-talk-wrap ai-talk-wrap2" v-if="item.talkType === AI_TALK && item.recommend.type === 2">
            <div class="ai-talk-content">
              <span>{{ item.responseStr }}</span>
              <template v-if="item.recommend.content.length">
                <div class="deliver"></div>
                <div class="tags-wrap">
                  <div class="tags-item" v-for="(itm, idx1) in item.recommend.content" :key="idx1"
                    @click="pushResponseListMainTalk({ content: itm, id: item.internal }, MAIN_TALK, SEND_CLICK)">{{ itm
                    }}
                  </div>
                </div>
              </template>
              <!-- 反馈按钮 -->
              <feed-back v-if="item.talkType === AI_TALK" @feedBack="item.feedbackStatus = true" :talk-card="item"
                @handleScrollBottom="scrollChange"></feed-back>
            </div>
          </div>
          <!-- 3   详情 -->
          <div class="ai-talk-wrap ai-talk-wrap3" v-if="item.talkType === AI_TALK && item.recommend.type === 3">
            <div class="ai-talk-content">
              <span class="bold" v-if="item.response.title">{{ item.response.title }}</span>
              <div class="deliver1" v-if="item.response.title"></div>
              <div class="detail-item" v-for="(itm, index) in item.response.list" :key="index">
                <div class="label bold">{{ itm.label }}</div>
                <div class="label-con" v-for="(itm1, inx1) in itm.list" :key="inx1">{{ itm1 }}</div>
              </div>
              <div class="deliver" v-if="item.recommend.content.length"></div>
              <div class="tags-wrap" v-if="item.recommend.content.length">
                <div class="tags-item" v-for="(itm, idx1) in item.recommend.content" :key="idx1"
                  @click="pushResponseListMainTalk({ content: itm, id: item.internal }, MAIN_TALK, SEND_CLICK)">{{ itm }}
                </div>
              </div>
              <!-- 反馈按钮 -->
              <feed-back v-if="item.talkType === AI_TALK" @feedBack="item.feedbackStatus = true" :talk-card="item"
                @handleScrollBottom="scrollChange"></feed-back>
            </div>
          </div>
          <!-- 4  层级 -->
          <div class="ai-talk-wrap ai-talk-wrap4" v-if="item.talkType === AI_TALK && item.recommend.type === 4">
            <div class="ai-talk-content">
              <span class="bold" v-if="item.response.title">{{ item.response.title }}</span>
              <div class="deliver1" v-if="item.response.title"></div>
              <!-- true则 流程 -->
              <template v-if="item.response.secondList.length">
                <div class="level-wrap" v-for="(itm, index) in item.response.list" :key="index">
                  <div class="level1 label" :class="`label-${index}`">
                    <div class="icon" v-if="index < 3"></div>
                    <div class="icon" v-else>{{ index + 1 }}</div>
                    <div class="text bold">{{ itm.substring(2) }}</div>
                  </div>
                  <div class="level2" v-if="item.response.secondList[index]">
                    <pre> {{ (item.response.secondList[index]) }} </pre>
                  </div>
                </div>
              </template>
              <template  v-else>
                <div class="level-wrap" v-for="(itm, index) in item?.response.list" :key="index">
                  <div class="level1 label" :class="`label-${index}`">
                    <div class="icon" v-if="index < 3"></div>
                    <div class="icon" v-else>{{ index + 1 }}</div>
                    <div class="text">{{ itm.substring(2) }}</div>
                  </div>
                </div>
              </template>
              <!-- 增加处理list为空的乱码标识 -->
              <template v-if="!item?.response.list.length">
                <pre> {{ (item?.responseStr) }} </pre>
              </template>
              <div class="deliver" v-if="item.recommend.content.length"></div>
              <div class="tags-wrap" v-if="item.recommend.content.length">
                <div class="tags-item" v-for="(itm, idx1) in item.recommend.content" :key="idx1"
                  @click="pushResponseListMainTalk({ content: itm, id: item.internal }, MAIN_TALK, SEND_CLICK)">{{ itm }}
                </div>
              </div>
              <!-- 反馈按钮 -->
              <feed-back v-if="item.talkType === AI_TALK" @feedBack="item.feedbackStatus = true" :talk-card="item"
                @handleScrollBottom="scrollChange"></feed-back>
            </div>
          </div>
        </div>
        <!-- 聊天加载框 -->
        <div class="chating-wrap" v-if="loadShow">
          <div class="chating-loading"></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <van-field v-model.trim="sendMsg" center placeholder="请输入想咨询的内容…">
        <template #button>
          <van-button size="small" type="primary" :disabled="!sendMsg || loadShow"
            @click="pushResponseListMainTalk({ content: sendMsg, id: '' })">发送</van-button>
        </template>
      </van-field>
    </div>
    <!-- <van-overlay :show="loadShow">
      <div class="overlay-wrap">
        <van-loading type="spinner" color="#1989fa" />
        <span>加载中</span>
      </div>
    </van-overlay> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { Field, Button, Overlay, showConfirmDialog } from "vant";
import { useRoute } from "vue-router";
import { AiApiObj } from "@/apis/modules/ai";
import { FeedBack } from "./components/index";

const MAIN_TALK = "MAIN_TALK";
const AI_TALK = "AI_TALK";
const SEND_INPUT = "SEND_INPUT";
const SEND_CLICK = "SEND_CLICK";

const regex = /^[0-9]/;

const route = useRoute();

const innerHeight = window.innerHeight;
// 问答list
const responseList = ref<any[]>([]);

const canScroll = ref(true);

// 发送消息
const sendMsg = ref("");
const uuid = ref("");
const loadShow = ref(false);

// URl中的初始化消息
const initSendMsg = computed(() => {
  return route.query?.message || "";
});

const getStrIndex = (str: string, text: string) => {
  return str.indexOf(text);
};

// type: sendType === SEND_INPUT ? "1" : "0",  type: 0-点选，1-文本输入
// 添加提问输入 输入id为空  点击未回答id
const pushResponseListMainTalk = async (
  con: { content: string; id: string },
  talkType = MAIN_TALK,
  sendType = SEND_INPUT
) => {
  const { content, id } = con;
  responseList.value.push({
    content,
    id,
    type: sendType === SEND_INPUT ? "1" : "0",
    talkType
  });
  sendMsg.value = "";
  // load
  loadShow.value = true;
  scrollToBottom();

  try {
    const { data } = await AiApiObj.getAiMsg({
      sessionId: uuid.value,
      id,
      type: sendType === SEND_INPUT ? "1" : "0",
      content
    });
    canScroll.value = true;

    const recommend = JSON.parse(data.recommend);
    let resultObj = {};
    if (recommend.type === 1 || recommend.type === 2) {
      resultObj = {
        internal: data.internal,
        responseStr: data.responseStr.startsWith("\n")
          ? data.responseStr.substring(2)
          : data.responseStr,
        recommend: JSON.parse(data.recommend),
        talkType: AI_TALK
      };
    }
    // 层级
    if (recommend.type === 4) {
      // 处理 层级展示
      const response = {
        title: "",
        list: [] as any[],
        secondList: [] as any[] // 这个是为了展示二级回复
      };

      // data.responseStr = "申请条件如下：\n在法定劳动年龄内、有就业能力和愿望且属于失业状态的以下人员：\n1.女性年满四十周岁或者男性年满五十周岁的失业人员；\n2.连续失业一年以上人员；\n3.失地农民；\n4.城镇零就业家庭成员或者享受城镇居民最低生活保障的人员；\n5.农村零转移就业贫困家庭成员；\n6毕业一年以上未就业的高校毕业生；\n7.残疾人；\n8.各级社会福利机构供养的成年孤儿和社会成年孤儿；\n9.县级以上人民政府规定的其他人员。\n10建档立卡贫困人员\n建议在办理前查阅最新的官方信息或咨询当地相应办事机关，以确保获取最准确的信息和指导。";

      const arr = data.responseStr.split("\n");
      // 清洗掉标题
      const arr1 = arr.filter((item: string) => {
        return (!item.endsWith(":") && !item.endsWith("："));
      });
      const titleList = arr.filter((item: string) => {
        return (item.endsWith(":") || item.endsWith("："));
      });
      const title = titleList.length ? titleList[0] : '';

      const lineList = [] as string[]; // 流程标题
      const lineSecond = [] as string[]; // 流程内容

      // 获取流程标题
      arr1.forEach((item: string) => {
        if (regex.test(item)) {
          lineList.push(item);
        }
      });
      // 获取流程内容
      lineList.forEach((item, idx) => {
        const idx1 = getStrIndex(data.responseStr, item);
        const idx2 = getStrIndex(data.responseStr, lineList[idx + 1]);
        if (idx < lineList.length - 1) {
          lineSecond.push(
            data.responseStr.substring(idx1, idx2).trim()
          );
        } else {
          lineSecond.push(data.responseStr.substring(idx1).trim());
        }
      });
      // 清洗流程内容
      lineList.forEach((item, index) => {
        // item !== lineSecond[index] 解决清单不需要层级
        if (item !== lineSecond[index]) {
          lineSecond[index] = lineSecond[index].replace(item + '\n', "");
        } else {
          lineSecond[index] = '';
        }
      });

      // 赋值
      response.list = lineList;
      response.title = title;
      response.secondList = lineSecond;

      resultObj = {
        internal: data.internal,
        responseStr: data.responseStr.startsWith("\n")
          ? data.responseStr.substring(2)
          : data.responseStr,
        recommend: JSON.parse(data.recommend),
        talkType: AI_TALK,
        response
      };
    }
    // 详情
    if (recommend.type === 3) {
      // 详情处理
      const response = {
        title: "",
        list: [] as any[]
      };
      const arr1 = data.responseStr.split("\n");
      // 清洗掉 单独展示的标题
      const arr = arr1.filter((item: string) => {
        return (!item.endsWith(":") && !item.endsWith("：") && !item.endsWith("？"));
      });
      const titleList = arr1.filter((item: string) => {
        return (item.endsWith(":") || item.endsWith("："));
      });
      const title = titleList.length ? titleList[0] : '';
      for (const item of arr) {
        let obj = {
          label: "",
          list: [] as any[]
        };
        const arr2 = item.split("：");
        if (arr2[0] === "交通方式") {
          // 交通方式统一处理
          obj = {
            label: item.substring(0, 5),
            list: [
              item.substring(item.indexOf("公交"), item.indexOf("地铁")),
              item.substring(item.indexOf("地铁"), item.length)
            ]
          };
        } else {
          obj = {
            label: arr2[0],
            list: [arr2[1]]
          };
        }
        response.list.push(obj);
      }
      response.title = title;
      resultObj = {
        internal: data.internal,
        responseStr: data.responseStr.startsWith("\n")
          ? data.responseStr.substring(2)
          : data.responseStr,
        recommend: JSON.parse(data.recommend),
        talkType: AI_TALK,
        response
      };
    }

    // 历史记录添加 及 滚动底部
    responseList.value.push(Object.assign(resultObj, { feedbackStatus: false }, { responseId: data.responseId }));

    scrollToBottom();
    loadShow.value = false;

    // 刷新话题
    if (data.nodeType === 'end') {
      handelFresh(data);
    } else if (data.nodeType === 'tree_judge') {
      // 切换话题
      handelSwitch(data);
    }
  } catch (error) {
    loadShow.value = false;
  }
};
const handelFresh = async (data: any) => {
  showConfirmDialog({
    message:
      '检测到您的聊天主题发生了改变,请问是否开启新的聊天？',
  })
    .then(() => {
      pushResponseListMainTalk(
        { content: '开始新的咨询', id: "" },
        MAIN_TALK,
        SEND_INPUT
      );
    })
    .catch(() => {
      pushResponseListMainTalk(
        { content: '继续之前的咨询', id: "" },
        MAIN_TALK,
        SEND_INPUT
      );
    });
};
const handelSwitch = async (data: any) => {
  showConfirmDialog({
    message:
      '检测到您在询问新的事项，是否切换新的事项？',
  })
    .then(() => {
      pushResponseListMainTalk(
        { content: '切换', id: "" },
        MAIN_TALK,
        SEND_INPUT
      );
    })
    .catch(() => {
      pushResponseListMainTalk(
        { content: '不切换', id: "" },
        MAIN_TALK,
        SEND_INPUT
      );
    });
};
const scrollChange = (type: boolean) => {
  canScroll.value = false;
};

const getUuid = async () => {
  const { data } = await AiApiObj.getUuid();
  uuid.value = data;
};

onMounted(async () => {
  // 获取uuid
  await getUuid();
  // 初始化提问
  initSendMsg.value &&
    pushResponseListMainTalk(
      { content: initSendMsg.value as string, id: "" },
      MAIN_TALK,
      SEND_INPUT
    );
});

// 滚动底部
const scrollToBottom = () => {
  nextTick(() => {
    const height = (document.getElementById("content-scroll") as any)
      .scrollHeight;
    window.scrollTo({ top: height, left: 0, behavior: "smooth" });
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

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
