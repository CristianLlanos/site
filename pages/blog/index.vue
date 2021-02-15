<template>
  <main
    v-if="blogPosts"
    class="main"
  >
    <h1 class="title text-left">Blog</h1>
    <ul
      v-for="(blogPost, index) in blogPosts"
      :key="index"
      class="articles"
    >
      <nuxt-link
        :to="`blog/${blogPost.slug}`"
        class="article article--clickable"
      >
        <div class="flex justify-between align-baseline">
          <h3 class="article-title">{{ blogPost.title }}</h3>
          <div
            v-if="blogPost.date"
            class="text-white font-smaller"
          >
            <span class="inline-block py-1 px-2 bg-accent rounded-sm dark:bg-accent whitespace-no-wrap">
              {{ formatDate(blogPost.date) }}
            </span>
          </div>
        </div>
        <div class="mt-4 mb-2">
          <p class="inline">{{ blogPost.description }}</p>
        </div>
      </nuxt-link>
    </ul>
  </main>
</template>
<script>
export default {
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
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
