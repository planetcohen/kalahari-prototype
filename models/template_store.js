var logger = require('../lib/logger');
var fs = require('fs');
var _ = require('underscore');
var utils = require('../lib/utils');


// ----------------------------------------------------------------------------
// constructor:
function TemplateStore(root, factory) {
  this.root = root;
  this.factory = factory;
  this.templates = null;
  return this;
}

// ----------------------------------------------------------------------------
// instance methods:
function loadTemplates() {
  if (this.templates !== null)  return;
  this.templates = {};

  var store = this;

  function loadFile(fname) {
    logger.debug("loadFile: fname =>", fname);

    var key = utils.keyFromFname(fname);
    logger.debug("key =>", key);

    var template = store.factory(key);
    store.templates[key] = template;
  }

  var filenames = fs.readdirSync(this.root);
  logger.debug("filenames =>", filenames);

  filenames.forEach(loadFile);
  logger.debug("Template::load: templates =>", Object.keys(this.templates));
  logger.debug("Template::load --------------");
}

function findTemplate(key) {
  return this.templates[key];
}

function loadTemplateSrc(key) {
  var filepath = [this.root, '/', key, '.hbs'].join('');
  logger.debug("filepath =>", filepath);
  var src = fs.readFileSync(filepath).toString();
  logger.debug("src =>", src);
  return src;
}

var instanceMethods = {
  loadTemplates: loadTemplates,
  findTemplate: findTemplate,
  loadTemplateSrc: loadTemplateSrc
};


// ----------------------------------------------------------------------------
_.extend(TemplateStore.prototype, instanceMethods);


// ============================================================================
module.exports = TemplateStore;
