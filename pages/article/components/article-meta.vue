<template>
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
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <!-- 自己的文章 编辑删除 -->
    <template v-if="user && article.author.username === user.username">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="
          $router.push({
            name: 'editor',
            query: {
              slug: article.slug,
            },
          })
        "
      >
        <i class="ion-edit"></i>
        &nbsp;Edit Article
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-outline-danger btn-sm"
        :disabled="deleteDisabled"
        @click="deleteArticle"
      >
        <i class="ion-trash-a"></i>
        &nbsp;Delete Article
      </button>
    </template>
    <!-- 他人的文章 关注 点赞 -->
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        :disabled="followDisable"
        @click="onFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{
          article.author.following
            ? "Unfollow Anah Benešová"
            : "Follow Eric Simons"
        }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        :disabled="favoriteDisabled"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { followUser, unFollowUser } from "@/api/profile";
import { deleteArticle } from "@/api/article";
import { mapState } from "vuex";
import { addFavorite, deleteFavorite } from "@/api/article";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      followDisable: false,
      favoriteDisabled: false,
      deleteDisabled: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    // 点赞操作
    async onFavorite() {
      if (!this.user) {
        this.$router.push("/login");
        return;
      }
      this.favoriteDisabled = true;
      if (this.article.favorited) {
        // 取消点赞
        await deleteFavorite(this.article.slug);
        this.article.favorited = false;
        this.article.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFavorite(this.article.slug);
        this.article.favorited = true;
        this.article.favoritesCount += 1;
      }
      this.favoriteDisabled = false;
    },

    // 关注操作
    async onFollow() {
      if (!this.user) {
        this.$router.push("/login");
        return;
      }
      this.followDisable = true;
      if (this.article.author.following) {
        // 取消关注
        await unFollowUser(this.article.author.username);
        this.article.author.following = false;
      } else {
        // 关注
        await followUser(this.article.author.usernam);
        this.article.author.following = true;
      }
      this.followDisable = false;
    },

    //删除文章
    async deleteArticle() {
      this.deleteDisabled = true;
      await deleteArticle(this.article.slug);
      this.deleteDisabled = false;
      this.$router.push("/");
    },
  },
};
</script>

<style></style>
