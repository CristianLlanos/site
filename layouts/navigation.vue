<template>
  <div class="bg-primary-800" style="max-width: 1200px; margin: 0 auto;">
    <div class="grid p-20 justify-between">
      <a href="/" class="flex">
        <div class="flex bg-gradient-primary p-2 rounded-full hover:rotate" style="width: 50px;">
          <img src="/img/profile.png" class="rounded-full object-cover w-fill h-fill" alt="Cristian Llanos" />
        </div>
      </a>
    </div>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from '~/components/Footer'

export default {
  name: 'navigation',
  components: {
    Footer,
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
