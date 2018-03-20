require('dotenv').config({
  silent: true
})
const htmlStandards = require('reshape-standard')

// const styleGuide = require('postcss-style-guide')
const cssStandards = require('spike-css-standards')

const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const df = require('dateformat')
const fn = require('format-num')
const SpikeDatoCMS = require('spike-datocms')
const MarkdownIt = require('markdown-it')
const markdownItFootnote = require('markdown-it-footnote')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const markdownItAttrs = require('markdown-it-attrs')
const markdownItContainer = require('markdown-it-container')
const markdownItSup = require('markdown-it-sup')
const markdownTOC = new MarkdownIt().use(markdownItTocAndAnchor, { anchorLink: false, tocFirstLevel: 3 })
const md = new MarkdownIt()

const locals = { }

const datos = new SpikeDatoCMS({
  addDataTo: locals,
  token: process.env.dato_api_key,
  models: [
    {
      name: 'quote',
      json: 'quotes.json'
    },
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
      },
      json: 'articles.json'
    },
    {
      name: 'report',
      template: {
        path: 'views/_report.sgr',
        output: (report) => { return `reports/${report.reportType.slug}/${report.slug}.html` }
      },
      transform: (data) => {
        markdownTOC.render(data.body, {
          tocCallback: function (tocMarkdown, tocArray, tocHtml) {
            data.toc_content = tocHtml
          }
        })
        return data
      }
    },
    {
      name: 'event',
      transform: (data) => {
        if (data.tickets) {
          const tickets = data.tickets
          tickets.forEach(function (ticket, index) {
            let tax = ticket.price * ticket.taxRate
            let total = ticket.price + tax
            ticket.total = total
          })
        }
        return data
      },
      template: {
        path: 'views/_event.sgr',
        output: (event) => { return `events/${event.slug}.html` }
      },
      json: 'events.json'
    },
    {
      name: 'home_page',
      template: {
        path: 'views/_home_page.sgr',
        output: (page) => { return `/index.html` }
      }
    },
    {
      name: 'contact_page',
      template: {
        path: 'views/_contact_page.sgr',
        output: (page) => { return `/contact.html` }
      }
    },
    {
      name: 'page',
      json: 'pages.json',
      template: {
        path: 'views/_page.sgr',
        output: (page) => {
          if (page.parentId) {
            return `/${page.parentId.slug}/${page.slug}.html`
          }
          else {
            return `/${page.slug}.html`
          }
        }
      },
      transform: (data) => {
        if (data.parentId === null) {
          data.overview = true
        }
        if (data.date) {
          const d = new Date(data.date)
          data.newdate = df(d, 'mmmm yyyy')
        }
        if (data.toc === true) {
          markdownTOC.render(data.body, {
            tocCallback: function(tocMarkdown, tocArray, tocHtml) {
              data.toc_content = tocHtml
            }
          })
        }
        return data
      }
    }
  ]
})

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  vendor: 'assets/js/vendor/**',
  ignore: [ '**/_layout.sgr', '**/layout.sgr', '**/.*', 'readme.md', 'yarn.lock', 'custom_modules/**', 'views/includes/**' ],
  reshape: htmlStandards ({
    parser: sugarml,
    // webpack: ctx,
    locals: (ctx) => { return Object.assign(locals,
      { pageId: pageId(ctx) },
      { df: df.bind(df) },
      { fn: fn.bind(fn) },
      { md: md.render.bind(md) }
    ) },
    markdownPlugins: [ markdownItFootnote, markdownItAttrs, markdownItContainer, markdownItSup, markdownItTocAndAnchor ],
    retext: { quotes: false }
  }),
  postcss: cssStandards({
    parser: sugarss,
    locals: { datos }
  }),
  babel: jsStandards(),
  plugins: [datos]
}
