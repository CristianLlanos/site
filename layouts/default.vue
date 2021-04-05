<template>
  <div class="bg-primary-800" style="max-width: 1200px; margin: 0 auto;">
    <nuxt />

    <Footer />
  </div>
</template>

<script>
import { TwitterIcon, GithubIcon, LinkedinIcon } from 'vue-feather-icons'
import Footer from '~/components/Footer'

export default {
  components: {
    TwitterIcon,
    GithubIcon,
    LinkedinIcon,
    Footer,
  },
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style>
.page {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
}
</style>
