<template>
  <div class="article-page">
  <div class="banner">
    <div class="container">
      <h1>{{ article.title }}</h1>

      <articleMeta :article="article" />
    </div>
  </div>

  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <div class="col-md-12" v-html="article.body"></div>
      </div>
    </div>

    <!-- 该文章的tag -->
    <ul class="tag-list">
          <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline ng-binding ng-scope" >
            {{tag}}
          </li>
    </ul>
    <hr />


    <div class="article-actions">
      <articleMeta :article="article" />
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <articleComments :article="article" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import articleMeta from './components/article-meta'
import articleComments from './components/article-comments'
export default {
    name: 'ArticleIndex',
    components: {
        articleMeta,
        articleComments
    },
    async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description }
      ]
    }
  }
}
</script>

<style>

</style>