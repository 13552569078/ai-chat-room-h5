import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetListDictCustomVOsDictSpace,IHistoryDictSpace, IHistorySpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL_WARNING;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;


/**
 * 数据访问，此类代码生成器生成
 */
class AiApi {
  data2Mock: boolean = false;

  // 查询字典列表|查询字典列表-DictController
  getUuid() {
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/findSessionId`;
    return requestHelper.getRequestData<IgetListDictCustomVOsDictSpace.Model>(url, '5b0fecd7-bbba-4000-9067-f0fb58308748', this.data2Mock);
  }
  // 会话聊天
  getAiMsg(params:{sessionId:string,id:string,type:string,content:string,phone:string,conversationId:string,name:string}) {
    const {id,type,content,sessionId,phone,conversationId,name} = params
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/findCounsellingResponse/?id=${id}&type=${type}&content=${content}&sessionId=${sessionId}&phone=${phone}&conversationId=${conversationId}&name=${name}`;
    return requestHelper.getRequestData<IgetListDictCustomVOsDictSpace.FormulaModel>(url, '5b0fecd7-bbba-4000-9067-f0fb58308748', this.data2Mock);
  }
  // 评分
  postStar(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/scoring`;
    return requestHelper.postRequestData<any>(url, 'fb3090bc-1018-448d-984d-cea7c43b2c3f', this.data2Mock, params);
  }
  // 查询最新的一次conversationId
  getHistoryLatest(phone:string){
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/getLatestChat?phone=${phone}`;
    return requestHelper.getRequestData<IHistorySpace.Model>(url, 'fb3090bc-1018-448d-984d-cea7c43b2c3f', this.data2Mock);
  }
  // 根据conversationId获取历史记录
  getHistorybyId(params:{conversationId:string,phone:string}){
    const {phone,conversationId} = params
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/getChatHistory?phone=${phone}&conversationId=${conversationId}`;
    return requestHelper.getRequestData<IHistorySpace.Model2>(url, 'fb3090bc-1018-448d-984d-cea7c43b2c3f', this.data2Mock);
  }
  // 根据手机号获取历史记录
  postHistoryApi(phone:string){
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/getConversationList?phone=${phone}`;
    return requestHelper.getRequestData<IHistoryDictSpace.Model>(url, 'fb3090bc-1018-448d-984d-cea7c43b2c3f', this.data2Mock, );
  }
  // 根据手机号删除历史记录
  getDelHistoryApi(params:{phone:string,conversationId:string}){
    const url = `${API_DOMAIN}${API_PREFIX}/counselling/deleteConversation`;
    return requestHelper.postRequestData<IHistoryDictSpace.Model>(url, 'fb3090bc-1018-448d-984d-cea7c43b2c3f', this.data2Mock, params);
  }
}
export const AiApiObj = new AiApi();
