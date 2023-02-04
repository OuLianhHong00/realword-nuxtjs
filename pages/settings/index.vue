<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="updateUser">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="userDetail.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="userDetail.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="userDetail.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="userDetail.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="userDetail.password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logOut">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from "@/api/user";

const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  async asyncData() {
    let userDetail = {
      email: "",
      password: "",
      username: "",
      bio: "",
      image: "",
    };
    const { data } = await getUser();
    userDetail = Object.assign({}, userDetail, data.user);
    return {
      userDetail,
    };
  },

  methods: {
    async updateUser() {
      const { data } = await updateUser({ user: this.userDetail });
      // 保存用户状态
      this.$store.commit("setUser", data.user);
      // 数据持久化
      Cookie.set("user", data.user);
      this.$router.push({
        name: "profile",
        params: {
          username: this.userDetail.username,
        },
      });
    },
    logOut() {
      Cookie.set("user", null);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style></style>
