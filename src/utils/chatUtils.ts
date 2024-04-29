// 处理1,2类型数据
export const mapChatoneortwo = (data:any) => {
  return {
    ...data,
    // feedbackStatus: false,
    internal: data.internal,
    responseStr: data.responseStr.startsWith("\n")
      ? data.responseStr.substring(2)
      : data.responseStr,
    recommend: JSON.parse(data.recommend),
  };
};

const regex = /^[0-9]/;

const getStrIndex = (str: string, text: string) => {
  return str.indexOf(text);
};

// 处理4类型数据
export const mapChatfour = (data:any) => {
// 处理 层级展示
  const response = {
    title: "",
    list: [] as any[],
    secondList: [] as any[] // 这个是为了展示二级回复
  };

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

  const resultObj = {
    ...data,
    internal: data.internal,
    responseStr: data.responseStr.startsWith("\n")
      ? data.responseStr.substring(2)
      : data.responseStr,
    recommend: JSON.parse(data.recommend),
    // feedbackStatus: false,
    response
  };

  return resultObj;
};

// 处理3类型数据
export const mapChatThree = (data:any) => {
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
  const resultObj = {
    internal: data.internal,
    responseStr: data.responseStr.startsWith("\n")
      ? data.responseStr.substring(2)
      : data.responseStr,
    recommend: JSON.parse(data.recommend),
    response
  };

  return {
    ...data,
    ...resultObj
  };
};
