var logger = require('../lib/logger');
var fs = require('fs');
var hbs = require('hbs').create();
var _ = require('underscore');
var utils = require('../lib/utils');


// ----------------------------------------------------------------------------
// constructor:
function Template(store, key) {
  logger.debug("Template::constructor: key =>", key, "; store =>", typeof(store));
  this.store = store;
  this.key = key;

  this.src = store.loadTemplateSrc(key);
  logger.debug("src =>", this.src);

  this.fn = hbs.handlebars.compile(this.src);
  logger.debug("Template::constructor: typeof(fn) =>", typeof(this.fn));

  return this;
}


// ----------------------------------------------------------------------------
// instance methods:
function render(attrs) {
  logger.debug("Template::render: this =>", this.key);
  logger.debug("Template::render: attrs =>", attrs);
  return this.fn(attrs);
}

var instanceMethods = {
  render: render
};


// ============================================================================
_.extend(Template.prototype, instanceMethods);


// ============================================================================
module.exports = Template;
