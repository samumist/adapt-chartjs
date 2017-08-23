define(function(require) {
  var Adapt = require('coreJS/adapt');
  var ComponentView = require('coreViews/componentView');
  var Chart = require('./Chart.min');
  var ChartJs = ComponentView.extend({
    events: {},

    preRender: function() {
      this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
      this.listenTo(Adapt, 'device:changed', this.onDeviceChanged);
      this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setupChart();
      this.$('.component-widget').on('inview', _.bind(this.inview, this));
    },

    setupChart: function() {
      var ctx = $('#myChart' + this.model.get('_id'));
      var myChart = new Chart(ctx, {
        type: this.model.get('_chartType'),
        data: this.model.get('data'),
        options: this.model.get('_options'),
      });

      this.setReadyStatus();
    },

    setupEventListeners: function() {},

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    inview: function(event, visible, visiblePartX, visiblePartY) {
      if (visible) {
        if (visiblePartY === 'top') {
          this._isVisibleTop = true;
        } else if (visiblePartY === 'bottom') {
          this._isVisibleBottom = true;
        } else {
          this._isVisibleTop = true;
          this._isVisibleBottom = true;
        }

        if (this._isVisibleTop && this._isVisibleBottom) {
          this.$(this.model.get('cssSelector')).off('inview');
          this.setCompletionStatus();
        }
      }
    },

    remove: function() {
      if ($('html').is('.ie8')) {
        var obj = this.$('object')[0];
        if (obj) {
          obj.style.display = 'none';
        }
      }
      this.$('.component-widget').off('inview');
      ComponentView.prototype.remove.call(this);
    },

    onCompletion: function() {
      this.setCompletionStatus();
    },

    onDeviceChanged: function() {},

    onScreenSizeChanged: function() {},

    onAccessibilityToggle: function() {},
  });

  Adapt.register('chartjs', ChartJs);
  return ChartJs;
});
