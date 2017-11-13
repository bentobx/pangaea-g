const env                     = require('dotenv').config()
const path                    = require('path')
const htmlStandards           = require('reshape-standard')

const styleGuide              = require('postcss-style-guide')
const cssStandards            = require('spike-css-standards')

const jsStandards             = require('spike-js-standards')
const pageId                  = require('spike-page-id')
const sugarml                 = require('sugarml')
const sugarss                 = require('sugarss')
const df                      = require('dateformat')
const SpikeDatoCMS            = require('spike-datocms')
const MarkdownIt              = require('markdown-it')
const markdownitFootnote      = require('markdown-it-footnote')
const markdownItTocAndAnchor  = require('markdown-it-toc-and-anchor').default
const markdownItAttrs         = require('markdown-it-attrs')
const markdownItContainer     = require('markdown-it-container')
const markdownItSup           = require('markdown-it-sup')
const markdown                = new MarkdownIt().use(markdownItTocAndAnchor, { anchorLink: false, tocFirstLevel: 3 })
const locals                  = { }

const datos = new SpikeDatoCMS({
  addDataTo: locals,
  token: process.env.dato_api_key,
  models: [{
    name: 'quote',
    template: {
      path: 'views/_page.sgr',
      output: (quote) => { return `quotes/${quote.slug}.html` }
    }
  },
  {
    name: 'home_page',
    template: {
      path: 'views/_home_page.sgr',
      output: (page) => { return `/index.html` }
    }
  },
  {
    name: 'page',
    template: {
      path: 'views/_page.sgr',
      output: (page) => { return `/${page.slug}.html` }
    },
    transform: (data) => {
      if (data.date) {
        const d = new Date(data.date)
        data.newdate = df(d, "mmmm yyyy")
      }
      // add toc to the local {{ item }} if toc is true
      markdown.render(data.body, {
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
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.css' },
  ignore: [ '**/layout.sgr', '**/.*', 'readme.md', 'yarn.lock', 'custom_modules/**' ],
  reshape: htmlStandards({
    parser: sugarml,
    locals: { md: markdown.render.bind(markdown) } ,
    markdownPlugins: [ markdownitFootnote, markdownItAttrs, markdownItContainer, markdownItSup ],
    retext: { quotes: false }
  }),
  postcss: cssStandards({
    appendPlugins: styleGuide({
      project: 'Pangaea 2.0',
      dest: 'public/styleguide.html'
    })
  }),
  babel: jsStandards(),
  plugins: [datos]
}
