<template>
  <div class="flex flex-col items-center px-30">
    <div class="content break-word" style="max-width: 700px;" v-html="about" />
  </div>
</template>

<script>
export default {
  name: 'about',
  layout: 'navigation',
  async asyncData({ payload }) {
    if (payload) {
      return { about: payload }
    }

    return {
      about: await require(`~/assets/content/site/credits.md`).default,
    }
  },
}
</script>
