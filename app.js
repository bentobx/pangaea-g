require('dotenv').config()

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const Records = require('spike-records')
const path = require('path')
const MarkdownIt = require('markdown-it')
const env = process.env.api_key

const md = new MarkdownIt()
const locals = {
  md: md.render.bind(md),
  mediaUrl: 'https://media.graphcms.com'
}
const apiUrl = 'https://api.graphcms.com/simple/v1/pangaea'

module.exports = {
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/index.html', '**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'views/templates/*.sgr'],
  reshape: htmlStandards({
    root: path.join(__dirname, 'views'),
    locals: (ctx) => locals
  }),
  postcss: cssStandards(),
  babel: jsStandards(),
  plugins: [
    new Records({
      addDataTo: locals,
      posts: {
        graphql: {
          url: apiUrl,
          headers: { Authorization: 'Bearer ' + process.env.api_key_local},
          query: `{
            allBlogPosts {
              postTitle, postSlug, postDateAndTime, postContent,
              authors {
                authorName
              }
            }
          }`
        },
        transform: (res) => res.data.allBlogPosts,
        template: {
          path: 'views/templates/post.sgr',
          output: (post) => `posts/${post.postSlug}.html`
        }

      }
    })
  ]
}
