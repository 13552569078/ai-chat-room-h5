/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 查询字典列表-Model类库
 */
export namespace IgetListDictCustomVOsDictSpace {
  export class RequestParams {
    typeCodeList?: string;
    constructor() {
      this.typeCodeList = "";
    }
  }

  export interface Data {
    typeCode: string;
    dictCode: string;
    dictName: string;
    selected: boolean;
  }

  export interface FormulaModel {
    code: number;
    desc: string;
    tips: string;
    data: any;
  }

  export interface AlarmRuleConfigModel {
    code: number;
    desc: string;
    tips: string;
    data: Array<{
      ruleCode: string;
      ruleName: string;
      ruleDesc: string;
      ruleValue: string;
    }>;
  }

  export interface AlarmCycleCornModel {
    code: number;
    desc: string;
    tips: string;
    data: Array<{
      name: string;
      value: string;
    }>;
  }



  export interface Model {
    code: number;
    desc: string;
    tips: string;
    data: string;
  }
}


// 历史记录
export namespace IHistoryDictSpace {
  export class RequestParams {
    phone?: string;
    constructor() {
      this.phone = "";
    }
  }

  export interface Data {
    conversationId: string;
    conversationTitle: string;
    createdTime: string;
    id: string;
    phone: string;
    tenantId: string;
    userName: string;
  }


  export interface Model {
    code: number;
    desc: string;
    tips: string;
    data: Data[];
  }
}

// IHistorySpace 最新的一个历史记录

export namespace IHistorySpace {
  export class RequestParams {
    phone?: string;
    constructor() {
      this.phone = "";
    }
  }

  export interface Data {
    conversationId: string;
    historyContent: string;
    phone: string;
    recommend: string;
    requestContent: string;
    responseContent: string;
    responseId: string;
    responseTime: string;
    sessionId: string;
    userName: string;
  }


  export interface Model {
    code: number;
    desc: string;
    tips: string;
    data: Data;
  }
  export interface Model2 {
    code: number;
    desc: string;
    tips: string;
    data: Data[];
  }
}