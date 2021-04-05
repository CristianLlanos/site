<template>
  <footer class="grid gap-20 justify-center py-100">
    <p class="grid grid-flow-col justify-center">
      <a
        href="https://twitter.com/cris_decode"
        target="_blank"
        class="secondary-700 p-10 hover:transform-scale-1.5"
      >
        <twitter-icon />
      </a>
      <a
        href="https://github.com/CristianLlanos"
        target="_blank"
        class="secondary-700 p-10 hover:transform-scale-1.5"
      >
        <github-icon />
      </a>
      <a
        href="https://www.linkedin.com/in/cristian-llanos/"
        target="_blank"
        class="secondary-700 p-10 hover:transform-scale-1.5"
      >
        <linkedin-icon />
      </a>
    </p>
    <div class="grid gap-10 text-xs">
      <p class="text-center">Made with 💙</p>
      <p class="text-center">
        <a href="/" class="link">Home</a> ·
        <a href="/about" class="link">About</a>
      </p>
      <p class="text-center">
        © Copyright {{ year }} ·
        <a href="/" class="link text-underline">cristianllanos.com</a>
      </p>
      <p style="max-width: 270px">
        Except where otherwise noted, content on this site is licensed under a
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          class="link"
        >Creative Commons Attribution 4.0 International license</a>.
      </p>
    </div>
  </footer>
</template>

<script>
import { GithubIcon, LinkedinIcon, TwitterIcon } from 'vue-feather-icons'

export default {
  name: 'Footer',
  components: {
    TwitterIcon,
    GithubIcon,
    LinkedinIcon,
  },
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
};
</script>
