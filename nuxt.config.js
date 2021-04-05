import path from 'path'
import glob from 'glob'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'
import postcssPresetEnv from 'postcss-preset-env'
import * as SITE_INFO from './assets/content/site/info.json'

const dynamicContentPath = 'assets/content' // ? No prepending/appending backslashes here
const dynamicRoutes = getDynamicPaths(
  {
    blog: 'blog/*.json',
    projects: 'projects/*.json',
  },
  dynamicContentPath
)

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    url:
      process.env.NODE_ENV === 'production'
        ? process.env.URL || 'http://createADotEnvFileAndSetURL'
        : 'http://localhost:3000',
    lang: SITE_INFO.sitelang || 'en-US',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: SITE_INFO.sitename || process.env.npm_package_name || '',
    htmlAttrs: {
      lang: SITE_INFO.sitelang || 'en-US',
      // class: 'light',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          SITE_INFO.sitedescription ||
          process.env.npm_package_description ||
          '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
    ],
  },

  generate: {
    routes: dynamicRoutes,
    fallback: true,
    subFolders: false,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/app.css', '@/assets/css/main.pcss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/date.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/markdownit'],

  markdownit: {
    injected: true,
    linkify: true,
    highlight: (str, lang) => {
      const hljs = require('highlight.js')
      if (lang && hljs.getLanguage(lang)) {
        try {
          const code = hljs.highlight(lang, str, true).value

          return '<pre class="hljs"><code>' + code + '</code></pre>'
        } catch (__) {}
      }

      return ''
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        'postcss-import': postcssImport,
        'postcss-nesting': postcssNesting,
        'postcss-preset-env': postcssPresetEnv({
          stage: 1,
          features: {
            'nesting-rules': false,
          },
        }),
      },
    },
  },
}

function getDynamicPaths(urlFilepathTable, cwdPath) {
  // eslint-disable-next-line no-console
  console.log(
    'Going to generate dynamicRoutes for these collection types: ',
    urlFilepathTable
  )
  const dynamicPaths = [].concat(
    ...Object.keys(urlFilepathTable).map((url) => {
      const filepathGlob = urlFilepathTable[url]
      return glob.sync(filepathGlob, { cwd: cwdPath }).map((filepath) => {
        return `/${url}/${path.basename(filepath, '.json')}`
      })
    })
  )
  // eslint-disable-next-line no-console
  console.log(
    'Found these dynamicPaths that will be SSR generated:',
    dynamicPaths
  )
  return dynamicPaths
}
