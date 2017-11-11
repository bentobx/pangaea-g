// const Collections = require('spike-collections')
// const Records = require('spike-records')
const SpikeDatoCMS = require('spike-datocms')

const path = require('path')

const reshape                 = require('reshape')
const expressions             = require('reshape-expressions')
const layouts                 = require('reshape-layouts')
const content                 = require('reshape-content')

// const htmlStandards           = require('reshape-standard')

const cssStandards            = require('spike-css-standards')
const jsStandards             = require('spike-js-standards')
// const pageId                  = require('spike-page-id')
const sugarml                 = require('sugarml')
const sugarss                 = require('sugarss')
const df                      = require('dateformat')

const MarkdownIt              = require('markdown-it')
const markdownitFootnote      = require('markdown-it-footnote')
const markdownItTocAndAnchor  = require('markdown-it-toc-and-anchor').default
const markdownItAttrs         = require('markdown-it-attrs')
const markdownItContainer     = require('markdown-it-container')
const markdownItSup           = require('markdown-it-sup')

const env = process.env.api_key
const md = new MarkdownIt().use(markdownItTocAndAnchor, { anchorLink: false, tocFirstLevel: 3 })

const locals = { }

// const apiUrl = 'https://api.graph.cool/simple/v1/cj9frf64r26kn0129ol67c71f'


const datos = new SpikeDatoCMS({
  addDataTo: locals,
  token: 'a3505e8e47ad3adecac3d794326a0e',
  models: [{
    name: 'quote',
    template: {
      path: 'views/_page.sgr',
      output: (quote) => { return `quotes/${quote.slug}.html` }
    }
  }, {
    name: 'page',
    template: {
      path: 'views/_page.sgr',
      output: (page) => { return `/${page.slug}.html` }
    },
    transform: (data) => {
      // const d = new Date(data.date)
      // data.newdate = df(d, "mmmm yyyy")
      // data.body = md.render(data.body)
      // add toc to the local {{ item }} if toc is true
      md.render(data.body, {
        tocCallback: function(tocMarkdown, tocArray, tocHtml) {
          data.toc_content = tocHtml
        }
      })
      return data
    }
  }]
})


module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: [ '**/layout.sgr', '**/.*', 'readme.md', 'yarn.lock', 'custom_modules/**' ],
  reshape: {
    locals: locals,
    plugins: [
      layouts(),
      expressions(),
      content()
    ],
    parser: sugarml
  },

  // reshape: {
  //   plugins: [ layouts(), expressions() ],
  //   parser: sugarml
  //   // locals: ctx => { return locals },
  //   // markdownPlugins: [[markdownitFootnote]],
  // },

  // reshape: standard({
  //
  //   // locals: ctx => {return Object.assign(md: md.render.bind(md))},
  //   markdownPlugins: [ markdownitFootnote, markdownItAttrs, markdownItContainer, markdownItSup ],
  //   retext: false,
  //   template: true,
  //   // markdown: { typographer: false, linkify: true },
  //   parser: sugarml
  // }),
  postcss: cssStandards({
    parser: sugarss,
    minify: env === 'production',
    warnForDuplicates: env !== 'production'
  }),
  babel: jsStandards(),
  // plugins: [datos, collections, records]
  plugins: [datos]
}
