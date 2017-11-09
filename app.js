const Collections = require('spike-collections')
const Records = require('spike-records')
const path = require('path')
const MarkdownIt = require('markdown-it')
const markdownitFootnote = require('markdown-it-footnote')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const df = require('dateformat')

const env = process.env.api_key

const md = new MarkdownIt().use(markdownitFootnote)
const locals = {
  md: md.render.bind(md),
}


const apiUrl = 'https://api.graph.cool/simple/v1/cj9frf64r26kn0129ol67c71f'

const collections = new Collections({
  addDataTo: locals,
  collections: {
    pages: {
      files: 'collections/pages/**',
      markdownLayout: 'views/__page_template.sgr',
      permalinks: (p) => {
        const m = p.match(/^.*?\/collections\/pages\/(.*?)\./)
        console.log(`${m[1]}`)
        return `${m[1]}.html`
      }
    }
    // reports: {
    //   files: 'collections/reports/**',
    //   markdownLayout: 'templates/post.sgr',
    //   permalinks: (p) => {
    //     const m = p.match(/^.*?\/reports\/(.*?)\./)
    //     // console.log(`${m[1]}`)
    //     return `${m[1]}.html`
    //   },
    //   transform: (data) => {
    //     const d = new Date(data.date)
    //     data.newdate = df(d, "mmmm yyyy")
    //     return data
    //   }
    // }
  }
})

const records = new Records({
  addDataTo: locals,
  posts: {
    graphql: {
      url: apiUrl,
      headers: { Authorization: 'Bearer ' + process.env.api_key},
      query: `{
        allQuotes {
          attribution, text
        }
      }`
    },
    transform: (res) => res.data.allQuotes,
    template: {
      path: 'views/quote.sgr',
      output: (post) => `quote/${post.postSlug}.html`
    }

  }
})

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/layout.sgr', '**/__post_template.sgr', '**/__page_template.sgr', '**/.*', 'readme.md', 'yarn.lock', 'custom_modules/**'],
  reshape: htmlStandards({
    parser: sugarml,
    locals: (ctx) => { return collections.locals(ctx, Object.assign({ pageId: pageId(ctx) }, locals)) },
    minify: env === 'production'
  }),
  postcss: cssStandards({
    parser: sugarss,
    minify: env === 'production',
    warnForDuplicates: env !== 'production'
  }),
  babel: jsStandards(),
  plugins: [collections, records]
}
