<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="text"
        ></textarea>
      </div>
      <div class="card-footer">
        <img v-if="user" class="comment-author-img" :src="user.image" />
        <img v-else class="comment-author-img" src="https://api.realworld.io/images/smiley-cyrus.jpeg" />
        <button class="btn btn-sm btn-primary" @click="addComment">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD, YYYY")
        }}</span>
        <span
          class="mod-options"
          v-if="
            article.author.username === user.username ||
            user.username === comment.author.username
          "
        >
          <i class="ion-trash-a" @click="deleteComment(comment.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, deleteComment, addComments } from "@/api/article";
import { mapState } from "vuex";

export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [], // 文章列表
      text: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  async mounted() {
    await this.getComments();
  },
  methods: {
    async getComments() {
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
    async addComment() {
      await addComments(this.article.slug, { comment: { body: this.text } });
      await this.getComments();
    },
    async deleteComment(id) {
      await deleteComment(this.article.slug, id);
      await this.getComments();
    },
  },
};
</script>

<style></style>
