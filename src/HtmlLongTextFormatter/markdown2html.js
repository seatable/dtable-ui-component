var markdown = require('remark-parse');
var slug = require('remark-slug');
var breaks = require('remark-breaks');
var remark2rehype = require('remark-rehype');
var format = require('rehype-format');
var raw = require('rehype-raw');
var xtend = require('xtend');
var toHTML = require('hast-util-to-html');
var sanitize = require('hast-util-sanitize');
var gh = require('hast-util-sanitize/lib/github');
var deepmerge = require('deepmerge').default;
const mathjax = require('rehype-mathjax/browser');
const math = require('remark-math/block');
var unified = require('./unified').default;
 
function stringify(config) {
  var settings = xtend(config, this.data('settings'));
  var schema = deepmerge(gh, {
    'attributes':{
      'input': [
        'type',
      ],
      'li': [
        'className'
      ],
      'code':[
        'className',
      ],
      'span': [
        'className'
      ],
      'div': [
        'className'
      ]
    },
    'tagNames': [
      'input',
      'code',
      'span',
      'div'
    ]
  });
  this.Compiler = compiler;

  function compiler(tree) {
    // use sanity to remove dangerous html, the default is
    // GitHub style sanitation
    var hast = sanitize(tree, schema);
    return toHTML(hast, settings);
  }
}

// markdown -> mdast -> html AST -> html
var processor = unified()
  .use(markdown, {commonmark: true})
  .use(math)
  .use(breaks)
  .use(slug)
  .use(remark2rehype, {allowDangerousHTML: true})
  .use(mathjax, {
    displayMath: ['$$', '$$'],
  })
  .use(raw)
  .use(format)
  .use(stringify);

var processorGetAST = unified()
  .use(markdown, {commonmark: true})
  .use(slug);

export { processor, processorGetAST };
