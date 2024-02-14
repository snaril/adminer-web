export async function fetchDataAndUpdateField(apiFunc, formItems, field) {
  try {
    const res = await apiFunc();
    const fieldItem = formItems.find((item) => item.field === field);
    if (fieldItem) {
      fieldItem.content = res;
    }
    return res;
  } catch (err) {
    console.error("获取数据失败：", err);
    throw err; // 或者根据你的需求处理错误
  }
}
