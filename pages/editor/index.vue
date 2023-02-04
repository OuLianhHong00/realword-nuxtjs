<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="article.tag"
                  @keyup.enter="addTag"
                />
                <div class="tag-list">
                  <span v-for="item in article.tagList" :key="item">
                    <span class="tag-default tag-pill ng-binding ng-scope">
                      <i class="ion-close-round" @click="remoeTag(item)"></i>
                      {{ item }}
                    </span>
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, addArticle, updateArticle } from "@/api/article";
export default {
  // 中间件， 判断是否已登录
  middleware: "authenticated",
  name: "EditorIndex",
  async asyncData({ query }) {
    let articleSlug = "";
    let article = {
      title: "",
      description: "",
      body: "",
      tag: "",
      tagList: [],
    };
    if (query.slug) {
      // 编辑
      articleSlug = query.slug;
      // 查询文章详情
      const { data } = await getArticle(articleSlug);
      article = Object.assign({}, article, data.article);
    }

    return {
      article,
      articleSlug,
    };
  },
  data() {},
  methods: {
    addTag() {
      if (this.article.tag) {
        const index = this.article.tagList.findIndex(
          (item) => item === this.article.tag
        );
        if (index === -1) {
          this.article.tagList.push(this.article.tag);
          this.article.tag = "";
        }
      }
    },

    remoeTag(tag) {
      const index = this.article.tagList.findIndex((item) => item === tag);
      if (index && index !== -1) {
        this.article.tagList.splice(index, 1);
      }
    },

    async onSubmit() {
      try {
         this.addTag();
         const { data }  = this.articleSlug ? await updateArticle(this.articleSlug, { article: this.article }) : await addArticle({ article: this.article });
        
        this.$router.push({
          name: "article",
          params: {
            slug: data.article.slug
          },
        });
      } catch (error) {
        console.log('error', error)
      }
    },
  },
};
</script>

<style></style>
