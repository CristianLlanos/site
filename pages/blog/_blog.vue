<template>
  <article
    v-if="blogPost"
    class="main article"
  >
    <h1 class="article-title font-bold pt-6">{{ blogPost.title }}</h1>
    <div
      v-if="blogPost.date"
      class="inline-block py-1 px-2 my-2 bg-accent text-white font-medium rounded-sm dark:bg-accent whitespace-no-wrap"
    >{{ formatDate(blogPost.date) }}</div>
    <div v-html="$md.render(blogPost.body)" class='content'/>
  </article>
</template>
<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) return { blogPost: payload }
    else
      return {
        blogPost: await require(`~/assets/content/blog/${params.blog}.json`)
      }
  },
  head() {
    return {
      title: this.blogPost.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.blogPost.description,
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString(process.env.lang) || ''
    }
  }
}
</script>
