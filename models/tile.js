var logger = require('../lib/logger');
var _ = require('underscore');


// ----------------------------------------------------------------------------
// utility methods:
function tileDataFromString(s) {
  return { src: s, template: s };
}


// ----------------------------------------------------------------------------
// constructor:
function Tile(store, key, src, templateKey, template) {
  logger.debug("Tile::constructor: src =>", src, "; template =>", templateKey);
  this.store = store;
  this.key = key;
  this.src = src;
  this.templateKey = templateKey;
  this.template = template;

  this.json = store.loadTileJson(key, src);
  logger.debug("json =>", this.json);

  return this;
}


// ----------------------------------------------------------------------------
// class methods:
function sanitizeTileData(tileData) {
  logger.debug("tileData =>", tileData);
  if (typeof(tileData) === 'string') {
    tileData = tileDataFromString(tileData);
  }
  logger.debug("tileData.src =>", tileData.src);
  logger.debug("tileData.template =>", tileData.template);
  return tileData;
}

var classMethods = {
  sanitizeTileData: sanitizeTileData
};


// ----------------------------------------------------------------------------
// instance methods:
function render() {
  logger.debug("Tile::render: tile =>", this.key, this.src);

  var html = this.template.render(this.json);
  logger.debug("html =>", html);

  return html;
}

var instanceMethods = {
  render: render
};


// ----------------------------------------------------------------------------
_.extend(Tile, classMethods);
_.extend(Tile.prototype, instanceMethods);


// ============================================================================
module.exports = Tile;
