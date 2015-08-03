var logger = require('../lib/logger');
var _ = require('underscore');
var Tile = require('../models/tile');


// ----------------------------------------------------------------------------
// constructor:
function Page(store, key, templateStore) {
  logger.debug("Page::constructor: store =>", typeof(store), "; key =>", key);
  this.store = store;
  this.key = key;
  this.templateStore = templateStore;

  var json = store.loadPageJson(key);
  this.meta = json.meta;
  this.layout = templateStore.findTemplate(this.meta.layout);
  this.wrapper = templateStore.findTemplate('wrapper');
  this.editor = templateStore.findTemplate('editor');
  logger.debug("wrapper =>", typeof(this.wrapper));
  this.tiles = json.tiles.map(function(t) {
    t = Tile.sanitizeTileData(t);
    var template = templateStore.findTemplate(t.template);
    return new Tile(store, key, t.src, t.template, template);
  });
  return this;
}


// ----------------------------------------------------------------------------
// instance methods:
function render(mode) {
  logger.debug("Page::render: this =>", this.key, "; mode =>", mode);
  mode = mode || 'show';

  var bodyHtml = this.renderBody(mode);
  logger.debug("bodyHtml =>", bodyHtml);

  var attrs = {
    title: this.meta.title,
    body: bodyHtml
  };
  logger.debug("attrs =>", attrs);

  if (mode == 'edit') {
    logger.debug("templateStore =>", Object.keys(this.templateStore));
    logger.debug("templateStore.templates =>", Object.keys(this.templateStore.templates));
    var templateStore = this.templateStore;
    var templates = Object.keys(templateStore.templates).map(function(key) {
      return {key: key};
    });

    var editorHtml = this.editor.render({templates: templates});
    logger.debug("editorHtml =>", editorHtml);
    _.extend(attrs, {editor: editorHtml});
  }
  logger.debug("attrs =>", attrs);

  return this.layout.render(attrs);
}

function renderEditor() {
  var editorTemplate = this.editorTemplate();
}

function _renderWrappedTile(page, tileSrc, tileHtml) {
  logger.debug("_renderWrappedTile: page =>", page.key);
  var props = {
    tile: tileHtml,
    tileSrc: tileSrc
  };

  var html = page.wrapper.render(props);
  logger.debug("html =>", html);

  return html;
}

function _renderTile(page, tile, mode) {
  logger.debug("_renderTile: page =>", page.key, "; tile =>", tile.key, "; mode =>", mode);
  var tileHtml = tile.render();
  return (mode === 'show') ? tileHtml : _renderWrappedTile(page, tile.src, tileHtml);
}

function renderBody(mode) {
  logger.debug("Page::renderBody: mode =>", mode);
  var page = this;
  var body = this.tiles.map(function(tile) {
    return _renderTile(page, tile, mode);
  }).join('');
  logger.debug("body =>", body);

  return body;
}

function findTile(tileKey) {
  logger.debug("Page::findTile: tileKey =>", tileKey);
  var tile = _.find(this.tiles, function(tile) {
    logger.debug("tile.src =>", tile.src);
    return tile.src == tileKey;
  });
  logger.debug("tile =>", tile.key);
  return tile;
}

var instanceMethods = {
  render: render,
  renderEditor: renderEditor,
  renderBody: renderBody,
  findTile: findTile
};


// ============================================================================
_.extend(Page.prototype, instanceMethods);


// ============================================================================
module.exports = Page;
