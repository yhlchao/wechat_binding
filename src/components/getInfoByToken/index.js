/*
 * 该组件页面通过access_token来获取信息
 * （不需要渲染）
 * 成功则跳转至用户信息页面
 */
import { getInfoByToken } from "../../api/bind";
import { loStorage } from "../../model/storage";

const InfoByToken = props => {
  // 异步使用access_token来获取信息
  const getInfo = async () => {
    const header = {
      Authorization: "Bearer " + loStorage.get("meta").access_token
    };
    const data = await getInfoByToken(header).catch(() => {
      // 失败
      // 
    });
    // 成功
    console.log(data);
    loStorage.set('info', data.data[0])
    props.history.replace("/user");
  };

  getInfo();
  return null;
};

export default InfoByToken;