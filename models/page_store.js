var logger = require('../lib/logger');
var fs = require('fs');
var _ = require('underscore');
var utils = require('../lib/utils');


// ----------------------------------------------------------------------------
// utility methods:
function loadJson(path) {
  logger.debug("loadJson: path =>", path);
  var buffer = fs.readFileSync(path);
  var string = buffer.toString();
  var json = JSON.parse(string);
  return json;
}


// ----------------------------------------------------------------------------
// constructor:
function PageStore(root, pageFactory) {
  this.root = root;
  this.pageFactory = pageFactory;
  this.pages = null;
  return this;
}

// ----------------------------------------------------------------------------
// instance methods:
function loadPages() {
  if (this.pages !== null)  return;
  this.pages = {};

  var store = this;

  function loadOnePage(dirname) {
    logger.debug("loadOne:: dirname =>", dirname);

    var key = utils.keyFromFname(dirname);
    logger.debug("key =>", key);

    var page = store.pageFactory(key);
    store.pages[key] = page;
  }

  var dirs = fs.readdirSync(this.root);
  logger.debug("dirs =>", dirs);

  dirs.forEach(loadOnePage);
}

function findPage(key) {
  return this.pages[key];
}

function findTile(pageKey, tileKey) {
  logger.debug("PageStore::findTile: page =>", pageKey, "; tile =>", tileKey);
  var page = this.findPage(pageKey);
  logger.debug("page =>", page.key);
  var tile = page.findTile(tileKey);
  logger.debug("tile =>", tile.key);
  return tile;
}

function loadPageJson(key) {
  logger.debug("PageStore::loadPageJson: key =>", key);
  var indexPath = [this.root, '/', key, '/index.json'].join('');
  logger.debug("indexPath =>", indexPath);
  return loadJson(indexPath);
}

function loadTileJson(key, src) {
  logger.debug("PageStore::loadTileJson: key =>", key, "; src =>", src);
  var tilePath = [this.root, '/', key, '/', src, '.json'].join('');
  logger.debug("tilePath =>", tilePath);
  return loadJson(tilePath);
}

var instanceMethods = {
  loadPages: loadPages,
  findPage: findPage,
  findTile: findTile,
  loadPageJson: loadPageJson,
  loadTileJson: loadTileJson
};


// ----------------------------------------------------------------------------
_.extend(PageStore.prototype, instanceMethods);


// ============================================================================
module.exports = PageStore;
