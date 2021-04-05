<template>
  <nuxt-link
    :to="`/blog/${post.slug}`"
    class="grid lg:grid-flow-col justify-center items-center rounded overflow-hidden bg-dark-700"
  >
    <figure class="flex justify-center items-center">
      <img class="w-fill h-fill visible" :src="post.image" alt="SRP" />
    </figure>
    <div class="grid gap-10 p-20">
      <div class="flex flex-col">
        <h3 class="text-2xl bold py-20">{{ post.title }}</h3>
        <p>{{ post.description }}</p>
      </div>
      <p class="text-right text-sm bold py-20 secondary-700">
        {{ formatDate(post.date) }}
      </p>
    </div>
  </nuxt-link>
</template>

<script>
import DateFormats from '~/assets/helpers/date-formats'

export default {
  name: 'BlogCardHighlighted',
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
