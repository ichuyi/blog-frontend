import axios from "axios";
const netease = axios.create({
  baseURL: "/netease",
  timeout: 10000,
  headers: {
    post: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  },
  withCredentials: true
});

//POST传参序列化(添加请求拦截器)
netease.interceptors.request.use(
  config => {
    //在发送请求之前做某件事
    if (config.method === "post") {
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  error => {
    console.log("错误的传参");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
netease.interceptors.response.use(
  res => {
    //对响应数据做些事
    return Promise.resolve(res);
  },
  error => {
    console.log("网络异常");
    return Promise.reject(error);
  }
);

//返回一个Promise(发送post请求)
export function neteasePost(url, params = {}) {
  params["cookie"] = localStorage.getItem("cookie")
  return new Promise((resolve, reject) => {
    netease
      .post(url, params)
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
////返回一个Promise(发送get请求)
export function neteaseGet(url, param = {}) {
  param["cookie"] = localStorage.getItem("cookie")
  return new Promise((resolve, reject) => {
    netease
      .get(url, { params: param })
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
export default {
  neteasePost,
  neteaseGet
};
