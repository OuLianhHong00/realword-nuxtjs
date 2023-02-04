<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
              looks like Peeta from the Hunger Games
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{
                active: profile.following,
              }"
              :disabled="followDisable"
              @click="onFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{
                profile.following
                  ? "Unfollow Anah Benešová"
                  : "Follow Eric Simons"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my-articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited-articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'favorited-articles',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list" v-for="tag in article.tagList" :key="tag">
                <li
                  class="tag-default tag-pill tag-outline ng-binding ng-scope"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
          <div class="article-preview" v-if="articles.length === 0">No articles are here... yet</div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page,
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tab: tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { followUser, unFollowUser, getProfile } from "@/api/profile";
import { getArticles } from "@/api/article";
import { mapState } from "vuex";
export default {
  middleware: "authenticated",
  name: "UserProfile",
  async asyncData({ params, query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const tab = query.tab || "my-articles";

    let param =
      tab === "my-articles"
        ? {
            author: params.username,
          }
        : {
            favorited: params.username,
          };
    const [profileRes, articleRes] = await Promise.all([
      getProfile(params.username),
      getArticles({
        limit,
        offset: (page - 1) * limit,
        ...param,
      }),
    ]);
    const profile = profileRes.data.profile;

    const { articles, articlesCount } = articleRes.data;

    // atricle点赞状态控制 点赞接口运行时不允许再次点击
    articles.forEach((article) => (article.favoriteDisabled = false));

    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      limit, // 每页大小
      page, // 页码
      tab, // 选项卡
      profile,
    };
  },
  watchQuery: ["page", "tab"],
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  data() {
    return {
      followDisable: false,
    };
  },
  methods: {
    // 关注操作
    async onFollow() {
      if(!this.user){
         this.$router.push('/login')
         return
      }
      this.followDisable = true;
      if (this.profile.following) {
        // 取消关注
        await unFollowUser(this.profile.username);
        this.profile.following = false;
      } else {
        // 关注
        await followUser(this.profile.usernam);
        this.profile.following = true;
      }
      this.followDisable = false;
    },
  },
};
</script>

<style></style>
