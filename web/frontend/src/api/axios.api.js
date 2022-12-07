import axios from "axios";

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}`;

const header = {};

const Axios_Instance = axios.create({
  baseURL: baseUrl,
  // headers: header
});

// For inject fn before send request to server
Axios_Instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// For inject fn after get response from server
Axios_Instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return Promise.resolve(response);
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

const axios_api = {
  get: (url, body) => {
    return new Promise((resolve, reject) => {
      Axios_Instance.get(`${baseUrl}${url}`, body)
        .then((res) => {
          console.log("get Response: ", res);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post: (url, body) => {
    return new Promise((resolve, reject) => {
      Axios_Instance.post(url, body)
        .then((res) => {
          console.log("post Response: ", res);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export { axios_api };
