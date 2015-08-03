var PageView = (function(undefined) {


  function PageView(model) {
    this.model = model;
    this.template = model.template;

    this.tileViews =  this.model.tiles.map(function(tile) {
      return new TileView(tile);
    })
  }

  function render(out) {
    var views = this.tileViews.map(function(tileView) {
      return tileView.render(out);
    })
    return this.template(model, views);
  }
})();


// ============================================================================
module.exports = PageView;
