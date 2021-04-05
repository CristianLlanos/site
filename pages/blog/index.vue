<template>
  <main v-if="blogPosts" class="px-30">
    <h1 class="text-5xl py-40">Blog</h1>
    <div class="grid gap-30 md:gap-40 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
      <BlogCard v-for="(post, index) of blogPosts" :key="index" :post="post" />
    </div>
  </main>
</template>
<script>
import BlogCard from '~/components/BlogCard'

export default {
  components: {
    BlogCard,
  },
  layout: 'navigation',
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('es-PE', options)
    },
  },
}
</script>
