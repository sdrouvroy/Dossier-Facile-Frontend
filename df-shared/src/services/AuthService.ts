import { User } from "../models/User";
import axios from "axios";

const API_URL = "//" + process.env.VUE_APP_API_URL + "/api/";

export const AuthService = {
  login(user: User) {
    return axios
      .post(API_URL + "auth", {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  },

  logout() {
    localStorage.removeItem("user");
  },

  register(user: User) {
    return axios.post(API_URL + "register/account", {
      email: user.username,
      password: user.password,
      confirm: user.confirm,
      reCaptchaResponse: user.captcha
    });
  },

  resetPassword(user: User) {
    return axios.post(API_URL + "reset", {
      username: user.username
    });
  },

  loadUser() {
    return axios.get(API_URL + "tenant/profile");
  }
};
