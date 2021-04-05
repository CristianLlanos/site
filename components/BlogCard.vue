<template>
  <nuxt-link
    :to="`/blog/${post.slug}`"
    class="grid justify-center items-center rounded overflow-hidden bg-dark-700 hover:rotate"
  >
    <figure class="flex justify-center items-center">
      <img class="w-fill h-fill visible" :src="post.image" alt="SRP" />
    </figure>
    <div class="grid gap-10 p-20 bold">
      <h3>{{ post.title }}</h3>
      <p class="text-right text-sm secondary-700">
        {{ formatDate(post.date) }}
      </p>
    </div>
  </nuxt-link>
</template>

<script>
import DateFormats from '~/assets/helpers/date-formats'

export default {
  name: 'BlogCard',
  props: {
    post: {
      required: true,
      type: Object,
    },
  },
  methods: {
    formatDate(date) {
      return DateFormats.long(date)
    },
  },
}
</script>
