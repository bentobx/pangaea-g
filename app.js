require('dotenv').config()

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const Records = require('spike-records')
const path = require('path')
const MarkdownIt = require('markdown-it')
const markdownitFootnote = require('markdown-it-footnote')

const env = process.env.api_key

const md = new MarkdownIt().use(markdownitFootnote)
const locals = {
  md: md.render.bind(md),
}
const apiUrl = 'https://api.graph.cool/simple/v1/cj9frf64r26kn0129ol67c71f'

module.exports = {
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/index.html', '**/layout.sgr', '**/.*', 'readme.md', 'yarn.lock', 'views/templates/*.sgr', 'custom_modules'],
  reshape: htmlStandards({
    root: path.join(__dirname, 'views'),
    locals: (ctx) => locals
  }),
  postcss: cssStandards(),
  babel: jsStandards(),
  plugins: [
    new Records({
      addDataTo: locals,
      quotes: {
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
          path: 'views/templates/quote.sgr',
          output: (post) => `quote/${post.postSlug}.html`
        }

      }
    })
  ]
}
