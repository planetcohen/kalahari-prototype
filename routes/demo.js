var logger = require('../lib/logger').verbose;
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var config = require('../config');


// ----------------------------------------------------------------------------
var Template = require('../models/template');
var TemplateStore = require('../models/template_store');
var Page = require('../models/page');
var PageStore = require('../models/page_store');


// ----------------------------------------------------------------------------
function templateFactory(key) {
  return new Template(gTemplateStore, key);
}
logger.debug("templateStoreRoot =>", config.templateStoreRoot);
var gTemplateStore = new TemplateStore(config.templateStoreRoot, templateFactory);
gTemplateStore.loadTemplates();


// ----------------------------------------------------------------------------
function editorFactory(key) {
  return new Template(gEditorStore, key);
}
logger.debug("editorStoreRoot =>", config.editorStoreRoot);
var gEditorStore = new TemplateStore(config.editorStoreRoot, editorFactory);
gEditorStore.loadTemplates();


// ----------------------------------------------------------------------------
function pageFactory(key) {
  return new Page(gPageStore, key, gTemplateStore);
}
logger.debug("pageStoreRoot =>", config.pageStoreRoot);
var gPageStore = new PageStore(config.pageStoreRoot, pageFactory);
gPageStore.loadPages();


// ============================================================================
function index(req, res, next) {
  logger.debug("demo index");
  res.render('demo', { title: 'Demo', slug: "index" });
}


// ----------------------------------------------------------------------------
function _renderPage(pageKey, mode) {
  logger.debug("_renderPage:: pageKey =>", pageKey, "; mode =>", mode);

  var page = gPageStore.findPage(pageKey);
  logger.debug("page =>", page.key);
  if (page === undefined) {
    res.send("page not found");
  }

  var html = page.render(mode);
  logger.debug("html =>", html);

  return html;
}

function showPage(req, res, next) {
  logger.debug("showPage --------------------", req.xhr);
  var html = _renderPage(req.params.page, 'show');
  logger.debug("html =>", html);

  res.send(html);
  logger.debug("-------------------- showPage");
}

function editPage(req, res, next) {
  logger.debug("editPage --------------------", req.xhr);
  var html = _renderPage(req.params.page, 'edit');
  logger.debug("html =>", html);

  res.send(html);
  logger.debug("-------------------- editPage");
}


// ----------------------------------------------------------------------------
function editTile(req, res, next) {
  logger.debug('');
  var pageKey = req.params.page;
  var tileKey = req.params.tile;
  logger.debug("edit:: pageKey =>", pageKey);
  logger.debug("edit:: tileKey =>", tileKey);

  var tile = gPageStore.findTile(pageKey, tileKey);
  logger.debug("tile =>", tile.key);

  var editor = gEditorStore.findTemplate(tile.templateKey);
  logger.debug("editor =>", editor.key);

  var action = 'edit/' + tile.src;
  var editorJson = _.extend(tile.json, { "action": action });

  var html = editor.render(editorJson);

  res.send(html);
}

function updateTile(req, res, next) {
  logger.debug('');
  var pageKey = req.params.page;
  var tileKey = req.params.tile;
  logger.debug("edit:: pageKey =>", pageKey);
  logger.debug("edit:: tileKey =>", tileKey);
  logger.debug("update:: body =>", req.body);

  var tile = gPageStore.findTile(pageKey, tileKey);
  logger.debug("tile =>", tile.key);

  _.extend(tile.json, req.body);
  res.redirect('/demo/' + pageKey + '/edit');
}


// ----------------------------------------------------------------------------
router.get('/', index);
router.get('/:page', showPage);
router.get('/:page/edit', editPage);
router.get('/:page/edit/:tile', editTile);
router.post('/:page/edit/:tile', updateTile);


// ============================================================================
module.exports = router;
