<template>
  <main>
    <figure class="flex justify-center items-center">
      <img class="w-fill" :src="blogPost.image" alt="SRP" />
    </figure>
    <div class="flex justify-center">
      <div class="flex rounded-full" style="margin-top: -110px; background: var(--color-primary-800); padding: 1em; transform: scale(0.8)">
        <a href="/" class="has-message flex rounded-full relative bg-gradient-primary" style="padding: 0.2em">
          <figure class="grid rounded-full overflow-hidden justify-center hover:rotate" style="width: 200px; height: 200px">
            <img
              src="/img/cristian-llanos-1350x904.jpg"
              alt="Cristian Llanos"
              title="Cristian Llanos"
              class="w-fill object-cover"
              style="width: 500px"
            />
          </figure>
          <div class="message-box flex justify-center absolute" style="bottom: -25%; left: 0; right: 0">
            <div class="message flex bg-dark-500 p-10 rounded">Aprendamos juntos 🤗</div>
          </div>
        </a>
      </div>
    </div>
    <article v-if="blogPost" class="article px-20 text-2xl">
      <h1 class="text-bg-color bold bg-gradient-soft text-4xl md:text-5xl py-30">{{ blogPost.title }}</h1>
      <div v-if="blogPost.date" class="text-sm dark-300">
        {{ $longDate(blogPost.date) }}
      </div>
      <div class="content" v-html="$md.render(blogPost.body)" />
      <section class="py-40">
        <div id="disqus_thread"></div>
        <script>
          /**
           *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
           *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
          /*
          var disqus_config = function () {
          this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
          this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
          };
          */
          (function() { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = 'https://cristianllanos.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
          })();
        </script>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
      </section>
    </article>
  </main>
</template>
<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) return { blogPost: payload }
    else {
      const blogPost = await require(`~/assets/content/blog/${params.blog}.json`)
      return {
        blogPost,
      }
    }
  },
  head() {
    return {
      title: this.blogPost.title,
      meta: [
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'description',
          name: 'description',
          content: this.blogPost.description,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.blogPost.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.blogPost.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: process.env.URL + this.blogPost.image,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.blogPost.title,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.blogPost.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.blogPost.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.URL + this.blogPost.image,
        },
        {
          hid: 'og:image:width',
          property: 'og:image:width',
          content: '2040',
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: '1170',
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: process.env.URL + this.blogPost.image,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.blogPost.title,
        },
      ],
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString(process.env.lang) || ''
    },
  },
}
</script>

<style>
.message-box {
  display: none;
}

.has-message:hover .message-box {
  display: flex;
}

.message::before {
  content: '▲';
  height: 10px;
  width: 10px;
  position: absolute;
  top: -12px;
  color: var(--color-dark-500);
}

.article {
  overflow-wrap: break-word;
  max-width: 680px;
  margin: 0 auto;
}
</style>
