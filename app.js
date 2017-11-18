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
const fn                      = require('format-num')
const SpikeDatoCMS            = require('spike-datocms')
const MarkdownIt              = require('markdown-it')
const markdownitFootnote      = require('markdown-it-footnote')
const markdownItTocAndAnchor  = require('markdown-it-toc-and-anchor').default
const markdownItAttrs         = require('markdown-it-attrs')
const markdownItContainer     = require('markdown-it-container')
const markdownItSup           = require('markdown-it-sup')
const markdown                = new MarkdownIt().use(markdownItTocAndAnchor, { anchorLink: false, tocFirstLevel: 3 })

const locals                  = { }

const stripe                  = require('stripe')(process.env.test_stripe_public_key);


const datos = new SpikeDatoCMS({
  addDataTo: locals,
  token: process.env.dato_api_key,
  models: [
  { name: 'quote' },
  {
    name: 'person',
    template: {
      path: 'views/_person.sgr',
      output: (person) => { return `profile/${person.slug}.html` }
    }
  },
  {
    name: 'article',
    template: {
      path: 'views/_article.sgr',
      output: (article) => { return `blog/${article.slug}.html` }
    }
  },
  {
    name: 'event',
    transform: (data) => {
      if (data.tickets) {
        const tickets = data.tickets
        tickets.forEach(function(ticket, index) {
          tax = ticket.price * ticket.taxRate
          total = ticket.price + tax
          ticket.total = total
        })
      }
      return data
    },
    template: {
      path: 'views/_event.sgr',
      output: (event) => { return `events/${event.slug}.html` }
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
      output: (page) => {
        // TODO: this is a bit precarious – don't use if nesting goes more
        // than one level deep. Refactor.
        if (page.parentId) { return `/${page.parentId.slug}/${page.slug}.html` }
        else { return `/${page.slug}.html` }
      }
    },
    transform: (data) => {
      if (data.date) {
        const d = new Date(data.date)
        data.newdate = df(d, "mmmm yyyy")
      }
      // add toc to the local {{ item }} if toc is true
      if (data.toc == true) {
        markdown.render(data.body, {
          tocCallback: function(tocMarkdown, tocArray, tocHtml) {
            data.toc_content = tocHtml
          }
        })
      }
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
    locals: { df: df.bind(df), fn: fn.bind(fn), md: markdown.render.bind(markdown) } ,
    markdownPlugins: [ markdownitFootnote, markdownItAttrs, markdownItContainer, markdownItSup ],
    retext: { quotes: false }
  }),
  postcss: cssStandards({
    locals: { datos }
    // ,
    // appendPlugins: styleGuide({
    //   project: 'Pangaea 2.0',
    //   dest: 'public/styleguide/index.html'
    // })
  }),
  babel: jsStandards(),
  plugins: [datos]
}
