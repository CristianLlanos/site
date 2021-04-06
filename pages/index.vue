<template>
  <div>
    <section class="grid lg:grid-cols-2 bg-dark-500">
      <figure class="flex w-fill bg-gradient-primary">
        <img
          :src="image"
          alt="Cristian Llanos"
          class="w-fill h-fill object-cover"
        />
      </figure>
      <header
        class="lg:row-start-1 grid gap-15 justify-center items-center py-30 px-20"
      >
        <p class="text-5xl bold">¡Hola 👋!</p>
        <h1 class="text-5xl bold text-bg-color bg-gradient-soft">
          Soy Cristian Llanos
        </h1>
        <p class="text-4xl">
          Arquitecto de Software apasionado por el código mantenible, seguro y escalable
        </p>
        <p class="grid grid-flow-col p-20 justify-center">
          <a
            href="https://twitter.com/cris_decode"
            target="_blank"
            class="p-10 hover:transform-scale-1.5"
          >
            <twitter-icon />
          </a>
          <a
            href="https://github.com/CristianLlanos"
            target="_blank"
            class="p-10 hover:transform-scale-1.5"
          >
            <github-icon />
          </a>
          <a
            href="https://www.linkedin.com/in/cristian-llanos/"
            target="_blank"
            class="p-10 hover:transform-scale-1.5"
          >
            <linkedin-icon />
          </a>
        </p>
      </header>
    </section>
    <section class="grid gap-30 py-100 justify-center">
      <h2 class="text-5xl text-center">Mi pasión</h2>
      <div class="grid gap-30 md:grid-cols-2 justify-center items-center">
        <gradient-box>
          <div class="text-2xl bold text-center">Arquitectura de Software</div>
          <div class="tags grid grid-flow-col gap-10 justify-center">
            <div class="p-5 bg-primary-700 primary-100 text-xs rounded">SOLID</div>
            <div class="p-5 bg-primary-700 primary-100 text-xs rounded">TDD</div>
            <div class="p-5 bg-primary-700 primary-100 text-xs rounded">CLEAN</div>
            <div class="p-5 bg-primary-700 primary-100 text-xs rounded">POO</div>
          </div>
        </gradient-box>
        <gradient-box>
          <div class="text-2xl bold text-center">Liderazgo Técnico</div>
          <div class="tags grid grid-flow-col gap-10 justify-center">
            <div class="p-5 bg-primary-700 primary-100 text-xs rounded">EMPATÍA</div>
            <div class="p-5 bg-primary-700 primary-100 text-xs rounded">EMPODERAMIENTO</div>
          </div>
        </gradient-box>
      </div>
    </section>
    <main class="grid gap-30 justify-center py-100 px-20 sm:px-60 bg-dark-500">
      <h2 class="text-5xl text-center">Blog</h2>
      <template v-for="(post, index) of blogPosts">
        <BlogCardHighlighted v-if="index === 0" :post="post" :key="index" />
        <div v-else class="grid gap-30 md:gap-40 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
          <BlogCard :post="post" :key="index" />
        </div>
      </template>
    </main>

    <section v-if="false" class="grid gap-30 justify-center py-40 px-20">
      <h2 class="text-5xl text-center">Suscríbete</h2>
    </section>
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import { TwitterIcon, GithubIcon, LinkedinIcon } from 'vue-feather-icons'
import DateFormats from '~/assets/helpers/date-formats'

export default {
  components: {
    TwitterIcon,
    GithubIcon,
    LinkedinIcon,
  },
  head() {
    return {
      script: [{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }],
      meta: [
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.siteInfo.sitename,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.siteInfo.sitedescription,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.image,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.siteInfo.sitename,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.siteInfo.sitename,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.siteInfo.sitedescription,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.image,
        },
        {
          hid: 'og:image:width',
          property: 'og:image:width',
          content: '1350',
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: '904',
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.image,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.siteInfo.sitename,
        },
      ],
    }
  },
  data() {
    return {
      image: process.env.URL + '/img/cristian-llanos-1350x904.jpg',
    }
  },
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
    },
    siteInfo() {
      return this.$store.state.siteInfo
    },
  },
  methods: {
    formatDate(date) {
      return DateFormats.long(date)
    },
  },
}
</script>
